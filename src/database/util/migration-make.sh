#!/bin/sh

name=$1
autoMigrate=$2

if [ -z "$autoMigrate" ]
then autoMigrate=false
fi

if [ -z "$name" ]
then
      echo "Error - Please provide migration name as first parameter (npm run makemigrations migrationName)"
      exit 1
else
      echo "migration name: $name"
      echo "typeorm migration:generate -n ./src/database/migrations/$name"
      node --require ts-node/register ./node_modules/typeorm/cli.js -d ./src/database/util/ormconfig.ts migration:generate ./src/database/migrations/$name

      if [ $autoMigrate = "true" ]
      then
        echo "Migrating..."
        npm run migrate
      fi
fi

