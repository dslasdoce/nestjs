import { AfterInsert, BeforeInsert, BeforeRemove, BeforeUpdate } from 'typeorm';
import * as url from 'url';
import Base from '../Base';
import { FileColumn, HAS_FILE_FIELDS, saveFileObject } from '../../../util/aws/FileField';
import CloudFrontHelper from '../../../util/aws/CloudFrontHelper';
import S3Helper from '../../../util/aws/S3Helper';
import { AppDataSource } from '../../util/ormconfig';
import ClassRegistry from './ClassRegistry';

export default abstract class BaseWithFileMethods extends Base {
  constructor() {
    super();
    // Automatically register the class when it's constructed
    ClassRegistry.registerClass(this.constructor);
  }

  public static filterColumnWithFile = (entityClass: any) => {
    return AppDataSource.getMetadata(entityClass).ownColumns.filter(
      (col) => col.transformer && col.transformer['isFileField'],
    );
  };

  getFileFields = () => {
    let fileFields = [];
    if (this.constructor[HAS_FILE_FIELDS]) {
      fileFields = BaseWithFileMethods.filterColumnWithFile(this.constructor);
    }
    return fileFields;
  };

  fileHandler = async (handler) => {
    for (const meta of this.getFileFields()) {
      await handler(meta);
    }
  };

  @BeforeUpdate()
  handleFileUpdate = async () => {
    await this.fileHandler(this.fileUploadHandler);
  };

  @BeforeInsert()
  handleFileUploads = async () => {
    await this.fileHandler(this.fileUploadHandler);
  };

  fileUploadHandler = async (meta) => {
    // ignore null and strings or accept isUploaded false because it would be a string
    if (typeof this[meta.propertyName] === 'object' && this[meta.propertyName]) {
      const { objectFullPath, mimetype } = await saveFileObject(this[meta.propertyName], this);
      this[meta.propertyName] = objectFullPath;
      this['mimetype'] = mimetype;
    } else if (meta?.transformer?.isFileField && this[meta.propertyName]) {
      try {
        // because of the file transformer that transforms path
        // to signed url, when you load an object then save it will
        // include the signing parameters and cloudfront dns,
        // so we have to make sure that we only get the PATH
        const raw = this[meta.propertyName];
        const objectURL = new url.URL(raw);
        this[meta.propertyName] = objectURL.pathname.replace(/^\/+/g, '');
      } catch (TypeError) {
        // no need to do anything because this means that it is a path already
      }
    }
  };

  @AfterInsert()
  convertPathToSignedUrl = async () => await this.fileHandler(this.fileFetchHandler);

  // during file fetching, we convert file path to signed urls
  fileFetchHandler = async (meta) => {
    this[meta.propertyName] = CloudFrontHelper.getSignedUrlFromPath(this[meta.propertyName]);
  };

  @BeforeRemove()
  removeS3Files = async () => {
    for (const meta of this.getFileFields()) {
      await S3Helper.delete(this[meta.propertyName]);
    }
  };

  getFileUploadUrl = (field: string) => {
    return S3Helper.getUploadUrlFromLink(this[field]);
  };
}
