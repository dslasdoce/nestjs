import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import User from './User';
import BaseWithFile from './abstract/BaseWithFile';

@Entity()
export default class File extends BaseWithFile {
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  user: User;

  @Column()
  fileName: string;

  @Column({ nullable: true })
  section: string;
}
