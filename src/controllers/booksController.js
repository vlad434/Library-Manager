const db = require("../../db/db");

const getAllBooks = (req, res) => {
  const query = "SELECT * FROM books";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch books" });
    } else {
      res.status(200).json(results);
    }
  });
};

module.exports = {
  getAllBooks,
};
