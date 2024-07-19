import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import File from '../../database/entities/File';
import AWSSNSValidator from '../../util/aws/AWSSNSValidator';
import * as request from 'request';
import S3Helper from '../../util/aws/S3Helper';
import { DEFAULT_FILE_PATH_FIELD_NAME } from '../../database/entities/abstract/BaseWithFile';
import ClassRegistry from '../../database/entities/abstract/ClassRegistry';

const SNS_TYPE_CONFIRMATION = 'SubscriptionConfirmation';
const SNS_TYPE_NOTIFICATION = 'Notification';

@Injectable()
export class AwsService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async findFileByFullPath(
    repository: Repository<File>,
    fullPath: any,
    options: object = {},
    fullPathFieldName: string = DEFAULT_FILE_PATH_FIELD_NAME, // this is the entity field that contains the filename
  ) {
    return repository.findOne({
      ...options,
      where: { [fullPathFieldName]: fullPath },
    });
  }

  processS3Webhook = async (req, body, res) => {
    await AWSSNSValidator.validate(body);

    // TODO: add security check
    if (body.Type == SNS_TYPE_CONFIRMATION) {
      request.get(body.SubscribeURL);
    }
    if (body.Type == SNS_TYPE_NOTIFICATION) {
      const message = JSON.parse(body.Message);
      const detail = message.detail;
      let fileFullPath = '';
      if (detail) {
        console.log('processS3Webhook:detail');
        fileFullPath = detail.object.key;
      } else {
        console.log('processS3Webhook:message:records');
        for (const rec of message?.Records) {
          fileFullPath = rec?.s3?.object?.key;
        }
        if (!fileFullPath) {
          return;
        }
      }

      const fileMeta = await S3Helper.getMetaData(fileFullPath);

      console.log('processS3Webhook:object:key', fileFullPath);
      const registeredFileEntities = ClassRegistry.getRegisteredClasses(); // Output: ['SubClassOne', 'SubClassTwo']

      for (const EntityClass of registeredFileEntities) {
        const fileFields = EntityClass['filterColumnWithFile'](EntityClass);
        let file = null;
        for (const field of fileFields) {
          file = await EntityClass['findOneBy']({ [field.propertyName]: fileFullPath });
          if (file) {
            break;
          }
        }

        if (file) {
          file.isUploaded = true;
          file.mimetype = fileMeta.ContentType;
          file.save();
          break;
        }
      }
    }
    res.json({ success: true });
  };
}
