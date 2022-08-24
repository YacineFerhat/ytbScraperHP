const mysql = require("mysql2");
const { host, user, database, password } = require("./config");

// create the connection to database
const connection = mysql.createConnection({
  host: host,
  user: user,
  database: database,
  password: password,
});

module.exports = {
  connection,
};
