import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from './util/ormconfig';

export const getRootConnection = () => TypeOrmModule.forRoot({ ...options, autoLoadEntities: true });
