#!/bin/sh
set -e

echo "Creating application databases..."
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
  CREATE DATABASE IF NOT EXISTS GROCERY_USER;
  CREATE DATABASE IF NOT EXISTS ADMIN_GROCERY;
EOSQL

echo "Importing GROCERY_USER.sql..."
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" GROCERY_USER < /docker-entrypoint-initdb.d/GROCERY_USER.sql.in

echo "Importing ADMIN_GROCERY.sql..."
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" ADMIN_GROCERY < /docker-entrypoint-initdb.d/ADMIN_GROCERY.sql.in

echo "Database initialization complete."
