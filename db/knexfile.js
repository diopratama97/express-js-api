// Update with your config settings.

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      connectionString:
        "postgres://ehiraxxzyuzsqg:96003a23693de9147dde1b2d9d9bf6eb990918a8aac63e82cc540fa5b59f1b4f@ec2-52-201-124-168.compute-1.amazonaws.com:5432/dc31em6b8org9s",
      ssl: { rejectUnauthorized: false },
    },
  },

  local: {
    client: "postgresql",
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_user_migrations",
    },
  },
};
