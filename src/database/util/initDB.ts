import config from 'config';
import { DataSource, DataSourceOptions } from 'typeorm';

const bootstrap = async () => {
  const url = new URL(config.database.connection);

  const username = url.username; // "postgres"
  const password = url.password; // "pass"
  const host = url.hostname; // "localhost"
  const database = url.pathname.split('/')[1];
  const tempURL = `postgres://${username}:${password}@${host}:5432/postgres`;

  console.log(config);
  console.log(tempURL);
  const subOptions: DataSourceOptions = {
    type: 'postgres',
    url: tempURL,
  };
  const dataSource = new DataSource(subOptions);
  const connection = await dataSource.initialize();
  try {
    await connection.query(`CREATE DATABASE "${database}"`);
  } catch (e) {
    console.log(e.toString());
  }

  await connection.destroy();
};

bootstrap().catch((e) => console.error(e));
