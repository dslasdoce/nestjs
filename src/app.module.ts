import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {getRootConnection} from "./database";
import {FileModule} from "./app/file/file.module";
import {AwsModule} from "./app/aws/aws.module";

@Module({
  imports: [getRootConnection(), AwsModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
