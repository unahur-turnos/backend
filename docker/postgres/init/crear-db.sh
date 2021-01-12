#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER unahur_desapp WITH PASSWORD 'desarrollo';

  CREATE DATABASE unahur_desapp_dev;
  GRANT ALL PRIVILEGES ON DATABASE unahur_desapp_dev TO unahur_desapp;

  CREATE DATABASE unahur_desapp_test;
  GRANT ALL PRIVILEGES ON DATABASE unahur_desapp_test TO unahur_desapp;
EOSQL
