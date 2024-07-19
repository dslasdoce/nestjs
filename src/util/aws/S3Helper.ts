import { DeleteObjectCommand, PutObjectCommand, S3Client, HeadObjectCommand, HeadObjectCommandOutput } from '@aws-sdk/client-s3';
import * as AWS from 'aws-sdk';
import path from 'path';
import * as config from 'config'
import * as url from 'url';

const signedUrlExpireSeconds = 60 * 60 * 24 * 7;
console.log(config.aws.s3);
export default class S3Helper {
  // s3 connected client
  static readonly s3Client = new S3Client({
    region: config.aws.s3.region,
    credentials: {
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
    },
  });

  static getHeadObjectParams = (fileName) => {
    return {
      Bucket: config.aws.s3.bucket,
      Key: fileName, // File name you want to save as in S3
    };
  };

  static getMetaData = async (fileName) => {
    let data: HeadObjectCommandOutput;
    try {
      data = await this.s3Client.send(new HeadObjectCommand(this.getHeadObjectParams(fileName)));
    } catch (err) {
      // file not found
      console.error(err);
    }

    return data;
  };

  // s3 libraries for signing
  static readonly s3 = new AWS.S3({
    credentials: {
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
    },
    region: config.aws.s3.region, //"us-west-2"
    signatureVersion: 'v4',
  });

  static getUploadUrlFromLink = (link) => {
    try {
      // Create the presigned URL.
      const fileName = url.parse(link).pathname.replace(/^\//g, '');
      const signedUrl = this.s3.getSignedUrl('putObject', {
        Bucket: config.aws.s3.bucket,
        Key: fileName,
        Expires: signedUrlExpireSeconds,
      });
      return signedUrl;
    } catch (err) {
      console.log('Error creating presigned URL', err);
      return null;
    }
  };

  // Setting up S3 upload parameters
  static getUploadParameters = (fileName, fileContent) => {
    const params = {
      Bucket: config.aws.s3.bucket,
      Key: fileName, // File name you want to save as in S3
      Body: fileContent,
    };
    return params;
  };

  static getDeleteParameters = (fileName) => {
    return {
      Bucket: config.aws.s3.bucket,
      Key: fileName, // File name you want to save as in S3
    };
  };

  static getDeleteDirParameters = (fileName) => {
    return {
      Bucket: config.aws.s3.bucket,
      Prefix: fileName, // File name you want to save as in S3
    };
  };

  static upload = async (fileName, fileContent) => {
    const data = await this.s3Client.send(new PutObjectCommand(this.getUploadParameters(fileName, fileContent)));
    if (data.$metadata.httpStatusCode === 200) console.log('s3 upload success');
    else console.log('s3 upload failed');

    return data;
  };

  static delete = async (fileName) => {
    if (!fileName) {
      return;
    }

    if (fileName.startsWith(config.aws.cloudfront.url)) {
      fileName = new URL(fileName).pathname.substring(1);
    }
    const mainObjectParams = this.getDeleteParameters(fileName);
    const data = await this.s3Client.send(new DeleteObjectCommand(mainObjectParams));

    const s3 = new AWS.S3({});
    console.log(path, path.extname(fileName), fileName);
    const objectExtRgx = new RegExp(`${path.extname(fileName)}$`);

    fileName = fileName.replace(objectExtRgx, '/');
    const directoryParams = this.getDeleteDirParameters(fileName);
    s3.listObjects(directoryParams, function (err, data) {
      const multiDeleteParams = {
        Bucket: directoryParams.Bucket,
        Delete: { Objects: [] },
      };

      data.Contents.forEach(function (content) {
        multiDeleteParams.Delete.Objects.push({ Key: content.Key });
      });
      if (multiDeleteParams.Delete.Objects.length) {
        s3.deleteObjects(multiDeleteParams);
      }
    });

    return data;
  };
}
