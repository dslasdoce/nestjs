import { Body, Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';

import { ResponseInterceptor } from '../../util/nestjs/interceptors/response.interceptor';
import { FileService } from './file.service';
import { UploadFileDto } from './dto/upload-file-dto';

@UseInterceptors(ResponseInterceptor)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload')
  createUploadLink(@Req() req: any, @Body() uploadFileDto: UploadFileDto) {
    return this.fileService.createFileUploadUrl(
      req.user?.id,
      uploadFileDto.fileName,
      uploadFileDto.mimetype,
      uploadFileDto.section,
    );
  }

  @Get('/my-files')
  myFiles(@Req() req: any) {
    return this.fileService.myFiles(req.user.id);
  }
}
