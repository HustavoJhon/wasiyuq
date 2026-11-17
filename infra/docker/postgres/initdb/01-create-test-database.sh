#!/bin/sh
# Runs only when the data volume is initialized for the first time.
# Creates the isolated test database next to the development database. Non-destructive.
set -eu

test_db="${POSTGRES_TEST_DB:-wasiyuq_test}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<SQL
SELECT 'CREATE DATABASE "${test_db}" OWNER "${POSTGRES_USER}"'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = '${test_db}')\gexec
SQL
