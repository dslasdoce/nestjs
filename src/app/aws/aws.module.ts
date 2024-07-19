import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';
import File from '../../database/entities/File';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [AwsController],
  providers: [AwsService],
})
export class AwsModule {}
