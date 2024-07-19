import 'reflect-metadata';
import Base from '../../database/entities/Base';
import { Column } from 'typeorm';
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';
import CloudFrontHelper from './CloudFrontHelper';
import * as uuid from 'uuid';
import * as path from 'path';

export const SUPPORTED_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/mov'];
export const MANIFEST_FILE_EXT = '.m3u8';

export const HAS_FILE_FIELDS = 'hasFileFields';
export const fileTransformer = {
  to: (value: any) => value,
  from: (value: any) => CloudFrontHelper.getSignedUrlFromPath(value),
  isFileField: true,
};



/**
 * On DB Insert - his column will process file object through:
 * 1. Save the file content into s3
 * 2. Save the filePath into database

 * On DB GET or After Insert - This column will:
 * 1. Convert the file path string on DB into a cloudfront signed url
 */
export function FileColumn(options?: ColumnOptions) {
  return function (object: any, propertyName: string) {
    if (typeof options !== 'undefined') {
      if (options['transformer']) {
        throw new Error('transformer option cannot be overridden for file field');
      }
    }
    options = options ? options : {};
    options['transformer'] = fileTransformer;
    object.constructor[HAS_FILE_FIELDS] = true;
    return Column(options)(object, propertyName);
  };
}

export const saveFileObject = async (file: any, entity: Base) => {
  const objectName = `${uuid.v1()}-${new Date().getTime()}`;
  const objectExt = path.extname(file.fileName);
  const mimetype = file?.mimetype?.toLowerCase();
  const objectBasePath = `${entity.constructor.name}/${objectName}`;
  const objectFullPath = `${objectBasePath}${objectExt}`;

  // add any file post-processing here but make sure to only handle those already uploaded file
  return { objectFullPath, mimetype, objectBasePath, objectName, objectExt };
};
