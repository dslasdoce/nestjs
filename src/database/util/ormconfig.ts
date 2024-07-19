import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { SeederOptions } from 'typeorm-extension';

import config from 'config';

console.log('********** RUNNING ENV: ' + config.env + ' **********');

export const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: config.database.connection,
  entities: [__dirname + '/../entities/*{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*'],
  seeds: [__dirname + '/../seeds/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
};

export const AppDataSource = new DataSource(options);
