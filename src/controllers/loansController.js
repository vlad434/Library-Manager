const db = require("../../db/db");

const getAllLoans = (req, res) => {
  const query = "SELECT * FROM loans";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch loans" });
    } else {
      res.status(200).json(results);
    }
  });
};

module.exports = {
  getAllLoans,
};
