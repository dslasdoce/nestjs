import { BaseEntity, CreateDateColumn, DeepPartial, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export default abstract class Base extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static createAndSave<T extends Base>(this: new () => T, data: DeepPartial<T>) {
    const entity = new this();
    Object.assign(entity, data);
    return entity.save();
  }
}
