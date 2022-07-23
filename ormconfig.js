module.exports = {
  type: "mysql",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: false,
  timezone: "local",
  migrations: ["dist/migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "src/migrations",
  },
  migrationsTableName: "migrations",
};
