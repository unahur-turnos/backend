import db from '../lib/models';

const TRUNCATE_QUERY = `do
$$
declare
  l_stmt text;
begin
  select 'truncate ' || string_agg(format('%I.%I', schemaname, tablename), ',') || ' RESTART IDENTITY CASCADE'
    into l_stmt
  from pg_tables
  where schemaname in ('public') AND pg_tables.tablename not in ('SequelizeMeta', 'SequelizeData');
  execute l_stmt;
end;
$$`;

export async function cleanDb() {
  await db.sequelize.query(TRUNCATE_QUERY);
}
