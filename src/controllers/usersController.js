const db = require("../../db/db");

const getAllUsers = (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    } else {
      res.status(200).json(results);
    }
  });
};

module.exports = {
  getAllUsers,
};
