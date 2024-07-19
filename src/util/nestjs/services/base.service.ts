import { HttpException } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { paginate } from 'nestjs-typeorm-paginate';
import { Brackets, DeepPartial, FindOptionsRelations, FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';

export default class BasePaginatedDto<Entity> {
  @IsOptional()
  @IsString({ each: true })
  searchBy: string[];

  @IsOptional()
  @IsString()
  @Type(() => String)
  searchCriteria = '';

  @IsOptional()
  @IsInt({ each: true, message: 'PAGE_MUST_BE_A_NUMBER' })
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @IsInt({ each: true, message: 'LIMIT_MUST_BE_A_NUMBER' })
  @Type(() => Number)
  limit = 20;

  @IsOptional()
  @IsString()
  order: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  orderBy: keyof Entity;

  @IsOptional()
  filters: Partial<Record<keyof Entity, any[]>>;
}

export class BaseService<T> {
  constructor(public serviceRepo: Repository<T>) {}

  findPaginatedQB(queryBuilder: SelectQueryBuilder<T>, page = 1, limit = 20) {
    return paginate<T>(queryBuilder, { page, limit });
  }

  async findPaginated(
    where: FindOptionsWhere<T>,
    page = 1,
    limit = 20,
    order: 'ASC' | 'DESC' = 'DESC',
    orderBy: keyof T | 'id' = 'id',
  ) {
    return paginate<T>(this.serviceRepo, { page, limit }, { where, order: { [orderBy]: order } } as any);
  }

  async find(filter: FindOptionsWhere<T>, relations: FindOptionsRelations<T> = undefined) {
    return await this.serviceRepo.find({ where: filter, relations });
  }

  async findById(id: number) {
    const entity = await this.serviceRepo.findOne({
      where: { id } as any,
    });
    if (!entity) throw new HttpException('NOT FOUND', StatusCodes.NOT_FOUND);
    return entity;
  }

  async create(data: DeepPartial<T>) {
    const entity = this.serviceRepo.create(data);
    return await this.serviceRepo.save(entity);
  }

  async deleteById(id: number) {
    const entity = await this.serviceRepo.findOne({
      where: { id } as any,
    });
    if (!entity) throw new HttpException('NOT FOUND', StatusCodes.NOT_FOUND);
    return await this.serviceRepo.remove(entity);
  }

  async update(id: number, data: DeepPartial<T>) {
    const entity = await this.serviceRepo.findOne({
      where: { id } as any,
    });
    if (!entity) throw new HttpException('NOT FOUND', StatusCodes.NOT_FOUND);
    await this.serviceRepo.update(id, data as any);
    return { ...entity, ...data };
  }
}

export function addSearchConditions<T>(
  queryBuilder: SelectQueryBuilder<T>,
  searchBy = ['query.firstName', 'query.lastName'],
  searchCriteria: string,
) {
  if (searchCriteria) {
    queryBuilder.andWhere(
      new Brackets((qb) => {
        searchBy.forEach((field, index) => {
          const likeStatement = `${field} ILIKE :searchCriteria`;
          const parameters = { searchCriteria: `%${searchCriteria}%` };

          if (index === 0) qb.where(likeStatement, parameters);
          else qb.orWhere(likeStatement, parameters);
        });
      }),
    );
  }
}

export function addFilters<T>(queryBuilder: SelectQueryBuilder<T>, filters: Partial<Record<keyof T, any[]>>) {
  if (!filters) return;
  Object.keys(filters).forEach((key) => {
    const filterValues = filters[key];
    if (filterValues?.length) queryBuilder.andWhere(`query.${key} IN (:...${key})`, { [key]: filterValues });
  });
}
