// Update with your config settings.
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      connectionString:
        "postgres://postgress:R00Tpostgress@localhost:1122/express-js-api",
      ssl: { rejectUnauthorized: false },
    },
  },

  local: {
    client: "postgresql",
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    // migrations: {
    //   tableName: "knex_user_migrations",
    // },
  },
};
