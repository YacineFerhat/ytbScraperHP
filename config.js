const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABaSE,
  password: process.env.PASSWORD,
  table: process.env.TABLE,
};
