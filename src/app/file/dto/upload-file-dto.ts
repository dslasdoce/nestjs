import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import errors from '../../../error-codes';

export class UploadFileDto {
  @IsNotEmpty({ message: errors.FILENAME_MUST_HAVE_A_VALUE })
  @IsString({ message: errors.FILENAME_MUST_BE_A_STRING })
  fileName: string;

  @IsOptional()
  @IsString({ message: errors.FILENAME_MUST_BE_A_STRING })
  mimetype: string;

  @IsOptional()
  section: string;
}
