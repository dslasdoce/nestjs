import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Brackets } from 'typeorm';

import User from '../../database/entities/User';
import BasePaginatedDto, { addFilters, addSearchConditions } from '../../util/nestjs/services/base.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/all')
  @UsePipes(ValidationPipe)
  getUsers(@Body() basePaginatedDto: BasePaginatedDto<User>) {
    console.log('basePaginatedDto', basePaginatedDto);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const queryBuilder = User.createQueryBuilder('query')
      .where('query.disabled = :disabled', { disabled: false })
      .andWhere('query.deletedAt IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where('query.lastActivityDate IS NULL');
          qb.orWhere('query.lastActivityDate > :ninetyDaysAgo', { ninetyDaysAgo });
        }),
      );

    addFilters(queryBuilder, basePaginatedDto.filters);
    addSearchConditions(queryBuilder, basePaginatedDto.searchBy, basePaginatedDto.searchCriteria);

    queryBuilder.orderBy(`query.${basePaginatedDto.orderBy || 'id'}`, basePaginatedDto.order || 'DESC');

    return this.userService.findPaginatedQB(queryBuilder, basePaginatedDto.page, basePaginatedDto.limit);
  }
}
