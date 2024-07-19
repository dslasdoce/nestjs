import * as cloudfrontSigner from 'aws-cloudfront-sign';
import * as config from 'config';
import RsaStringHelper from './RsaStringHelper';

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_HOUR = 3600;
const DEFAULT_EXPIRE_PERIOD_HOURS = 24 * 30;
const EXPIRE_PERIOD_MILLISECONDS = DEFAULT_EXPIRE_PERIOD_HOURS * SECONDS_PER_HOUR * MILLISECONDS_PER_SECOND;

export default class CloudFrontHelper {
  static getSignedUrlFromPath = (pathName, expiryTime = 0) => {
    if (pathName) {
      const url = new URL(pathName, config.aws.cloudfront.url);
      return this.urlSigner(url.href, expiryTime);
    } else {
      return null;
    }
  };
  static urlSigner = (url, expiryTime = 0) => {
    if (expiryTime === 0) {
      // unix timestamp in milliseconds
      expiryTime = Math.floor(new Date().getTime()) + EXPIRE_PERIOD_MILLISECONDS;
    }

    const signingParams = {
      keypairId: config.aws.cloudfront.keyId,
      privateKeyString: RsaStringHelper.processKeyString(config.aws.cloudfront.key),
      expireTime: expiryTime,
    };
    return cloudfrontSigner.getSignedUrl(url, signingParams);
  };
}
