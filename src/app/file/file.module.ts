import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import File from '../../database/entities/File'
import User from "../../database/entities/User";

@Module({
  imports: [TypeOrmModule.forFeature([File, User])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
