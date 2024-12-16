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

const addLoan = (req, res) => {
  const { user_id, book_id, loan_date } = req.body;
  const checkBookQuery = "SELECT * FROM books WHERE id = ? ";

  db.query(checkBookQuery, [book_id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch book details" });
    } else if (results.length === 0) {
      res.status(404).json({ error: `Book with ID ${book_id} not found` });
    } else if (results[0].copies_available <= 0) {
      res.status(400).json({ error: "No copies of the book are available" });
    } else {
      const createLoanQuery =
        "INSERT INTO loans (user_id, book_id, loan_date) VALUES (?, ?, ?)";
      db.query(
        createLoanQuery,
        [user_id, book_id, loan_date],
        (err, loanResults) => {
          if (err) {
            res.status(500).json({ error: "Failed to create loan" });
          } else {
            const updateBookQuery =
              "UPDATE books SET copies_available = copies_available - 1 WHERE id = ?";

            db.query(updateBookQuery, [book_id], (err, updateResults) => {
              if (err) {
                res.status(500).json({ error: "Failed to update book copies" });
              } else {
                res.status(200).json({
                  message: "Loan created successfully",
                  loanId: loanResults.insertId,
                });
              }
            });
          }
        }
      );
    }
  });
};

const getLoanById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM loans WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: `Failed to get loan with id: ${id}` });
    } else if (results.length == 0) {
      res.status(404).json({ error: "Loan not found" });
    } else {
      res.status(200).json(results[0]);
    }
  });
};

const updateLoan = (req, res) => {
  const { id } = req.params;
  const { user_id, book_id, loan_date } = req.body;
  const query = "SELECT * FROM loans WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch loan" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Loan not found" });
    } else {
      const existingLoan = results[0];
      const updatedUser_id = user_id || existingLoan.user_id;
      const updatedBook_id = book_id || existingLoan.book_id;
      const updatedLoan_date = loan_date || existingLoan.loan_date;

      const updateQuery =
        "UPDATE loans SET user_id = ?, book_id = ?, loan_date = ? WHERE id = ?";
      db.query(
        updateQuery,
        [updatedUser_id, updatedBook_id, updatedLoan_date, id],
        (err, results) => {
          if (err) {
            res.status(500).json({ error: "Failed to update loan!", err });
          } else {
            res.status(200).json({ message: "Loan updated successfully!" });
          }
        }
      );
    }
  });
};

const deleteLoan = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM loans WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: `Failed to delete book with id : ${id}` });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: `Loan with id ${id} not found` });
    } else {
      res
        .status(200)
        .json({ message: `Loan with id ${id} deleted successfully!` });
    }
  });
};

const searchLoans = (req, res) => {
  const { user_id, book_id, loan_date } = req.query;

  let query = "SELECT * FROM loans WHERE 1=1";
  const params = [];

  if (user_id) {
    query += " AND user_id LIKE ?";
    params.push(`%${user_id}%`);
  }

  if (book_id) {
    query += " AND book_id LIKE ?";
    params.push(`%${book_id}%`);
  }

  if (loan_date) {
    if (loan_date.length === 4) {
      query += " AND YEAR(loan_date) = ?";
      params.push(loan_date);
    } else if (loan_date.length === 7 && loan_date.includes("-")) {
      const [month, year] = loan_date.split("-");
      query += " AND MONTH(loan_date) = ? AND YEAR(loan_date) = ?";
      params.push(month, year);
    } else if (loan_date.length === 10 && loan_date.includes("-")) {
      const [day, month, year] = loan_date.split("-");
      query +=
        " AND DAY(loan_date) = ? AND MONTH(loan_date) = ? AND YEAR(loan_date) = ?";
      params.push(day, month, year);
    }
  }

  db.query(query, params, (err, results) => {
    if (err) {
      res.status(500).json({ error: "No loans were found!" });
    } else {
      res.status(200).json(results);
    }
  });
};

module.exports = {
  getAllLoans,
  addLoan,
  getLoanById,
  updateLoan,
  deleteLoan,
  searchLoans,
};
