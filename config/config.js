require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: "mysql"
  },
  test: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host:  process.env.DATABASE_HOST,
    dialect: "mysql"
  },
  production: {
    username: process.env.PRODUCTION_DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.PRODUCTION_DATABASE_NAME,
    host:  process.env.PRODUCTION_DATABASE_HOST,
    dialect: "mysql"
  }
}
