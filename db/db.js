const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Colorado&114",
  database: "library",
});
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});
module.exports = connection;
