import { HttpException } from '@nestjs/common';
import * as crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';

const requestretry = require('requestretry');

const CERT_URL_PATTERN =
  /^https:\/\/sns\.[a-zA-Z0-9-]{3,}\.amazonaws\.com(\.cn)?\/SimpleNotificationService-[a-zA-Z0-9]{32}\.pem$/;

export default class AWSSNSValidator {
  static fieldsForSignature(type: string) {
    if (type === 'SubscriptionConfirmation' || type === 'UnsubscribeConfirmation') {
      return ['Message', 'MessageId', 'SubscribeURL', 'Timestamp', 'Token', 'TopicArn', 'Type'];
    } else if (type === 'Notification') {
      return ['Message', 'MessageId', 'Subject', 'Timestamp', 'TopicArn', 'Type'];
    } else {
      return [];
    }
  }

  static async fetchCert(certUrl: string) {
    const result = await requestretry({
      method: 'GET',
      url: certUrl,
      maxAttempts: 3,
      retryDelay: 100,
      timeout: 3000,
    });
    if (result.statusCode !== 200) {
      throw new HttpException('invalid certificate url', StatusCodes.BAD_REQUEST);
    }
    return result.body;
  }

  static async validate(message) {
    if (
      !('SignatureVersion' in message && 'SigningCertURL' in message && 'Type' in message && 'Signature' in message)
    ) {
      throw new HttpException('sns: missing field', StatusCodes.BAD_REQUEST);
    } else if (message.SignatureVersion !== '1') {
      throw new HttpException('sns: invalid SignatureVersion', StatusCodes.BAD_REQUEST);
    } else if (!CERT_URL_PATTERN.test(message.SigningCertURL)) {
      throw new HttpException('sns: invalid certificate url', StatusCodes.BAD_REQUEST);
    } else {
      const certificate = await this.fetchCert(message.SigningCertURL);

      const verify = crypto.createVerify('sha1WithRSAEncryption');
      this.fieldsForSignature(message.Type).forEach((key) => {
        if (key in message) {
          verify.write(`${key}\n${message[key]}\n`);
        }
      });
      verify.end();
      const isValid = verify.verify(certificate, message.Signature, 'base64');
      if (!isValid) {
        throw new HttpException('invalid certificate', StatusCodes.BAD_REQUEST);
      } else {
        console.log('sns message valid');
      }
    }
  }
}
