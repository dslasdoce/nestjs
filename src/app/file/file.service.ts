import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../util/nestjs/services/base.service';
import File from '../../database/entities/File';
import User from '../../database/entities/User';

@Injectable()
export class FileService extends BaseService<File> {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {
    super(fileRepository);
  }

  async createFileUploadUrl(userId: number, fileName: string, mimetype = '', section: string = '') {
    const file = this.fileRepository.create({
      user: { id: userId } as User,
      fileName: fileName,
      isUploaded: false,
      mimetype: mimetype || '',
      section: section,
      // we created a file object with empty buffer to indicate
      // to file handlers under FileField.ts that this is for a
      // deferred file
      file: {
        fileName: fileName,
      } as any,
    });

    await this.fileRepository.save(file);

    return file.getFileUploadUrl('file');
  }

  myFiles = async (userId: number) => {
    return await this.fileRepository.find({ where: { user: { id: userId }, isUploaded: true }, order: { id: 'desc' } });
  };
}
