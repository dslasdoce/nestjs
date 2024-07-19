import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import uuid from 'uuid';
import Base from './Base';
import User from './User';

@Entity()
export default class UserSecretToken extends Base {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  secretJWT: string;

  static async createToken(userId: number) {
    const secretToken = uuid.v4();
    const userCreate = this.create({
      user: { id: userId },
      secretJWT: secretToken,
    });
    await this.save(userCreate);
    return secretToken;
  }
}
