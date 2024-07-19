import { runSeeders } from 'typeorm-extension';

import { AppDataSource } from './ormconfig';
import moment from 'moment-timezone';

AppDataSource.initialize().then(async (dataSource) => {
  console.log('setting default tz to utc.');
  moment.tz.setDefault('Etc/UTC');

  console.log('running migrations...');
  await dataSource.runMigrations();

  console.log('seeding...');
  await runSeeders(dataSource);
});
