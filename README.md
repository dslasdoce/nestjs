if you're using server database:
yarn install
yarn start:dev

if you're working with local database, first create a new database named "devrepo-local"
then run yarn migrate:dev

and finally start project

yarn start:dev

Create a migration:
npm run migration:create --name=your_migration_name

Create a entity:
npm run entity:create --name=your_entity_name
