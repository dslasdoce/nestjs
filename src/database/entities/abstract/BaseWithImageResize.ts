import * as url from 'url';
import { FileColumn, saveFileObject } from '../../../util/aws/FileField';
import BaseWithFileMethods from './BaseWithFileMethods';

export default abstract class BaseWithImageResize extends BaseWithFileMethods {
  @FileColumn({ nullable: true })
  image: string;

  @FileColumn({ nullable: true })
  imageLarge: string;

  @FileColumn({ nullable: true })
  imageSmall: string;

  @FileColumn({ nullable: true })
  imageThumb: string;

  fileUploadHandler = async (meta) => {
    // ignore null and strings or accept isUploaded false because it would be a string
    if (typeof this[meta.propertyName] === 'object' && this[meta.propertyName]) {
      const { objectFullPath, objectBasePath, objectName, objectExt } = await saveFileObject(
        this[meta.propertyName],
        this,
      );
      this[meta.propertyName] = objectFullPath;
      this.imageSmall = `${objectBasePath}-large${objectExt}`;
      this.imageLarge = `${objectBasePath}-small${objectExt}`;
      this.imageThumb = `${objectBasePath}-thumbnail${objectExt}`;
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
}
