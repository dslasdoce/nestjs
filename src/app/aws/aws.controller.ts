import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Public } from '../../util/nestjs/decorators/auth.decorator';
import { AwsService } from './aws.service';
import { Response, Request } from 'express';

const rawbody = require('raw-body');

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Public()
  @Post('/s3-webhook')
  async s3WebhookPost(@Req() req: Request, @Res() res: Response) {
    console.log('s3WebhookPost');
    let body;
    if (req.readable) {
      // body is ignored by NestJS -> get raw body from request
      const raw = await rawbody(req);

      body = JSON.parse(raw.toString().trim());
    } else {
      body = req.body;
    }
    await this.awsService.processS3Webhook(req, body, res);
  }
}
