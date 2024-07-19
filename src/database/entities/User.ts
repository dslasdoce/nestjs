import { Column, Entity, FindOptionsWhere, OneToOne } from 'typeorm';
import Base from './Base';
import UserSecretToken from './UserSecretToken';

@Entity()
export default class User extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  lastSignInDate: Date;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  disabled: boolean;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  lastActivityDate: Date;

  @OneToOne(() => UserSecretToken, (data) => data.user)
  userSecretToken: UserSecretToken;

  static findOneWithSecret(where: FindOptionsWhere<User>) {
    return this.findOne({
      where,
      relations: {
        userSecretToken: true,
      },
    });
  }
}
