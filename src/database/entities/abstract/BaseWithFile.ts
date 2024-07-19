import {
  AfterInsert,
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column
} from 'typeorm';
import {FileColumn} from "../../../util/aws/FileField";
import BaseWithFileMethods from "./BaseWithFileMethods";

export const DEFAULT_FILE_PATH_FIELD_NAME = 'file'

export default abstract class BaseWithFile extends BaseWithFileMethods {
  @Column({ default: false })
  isUploaded: boolean;

  @FileColumn()
  file: string;

  @Column({default: ''})
  mimetype: string

}
