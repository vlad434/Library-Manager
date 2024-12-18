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

const addNewBook = (req, res) => {
  const {
    title,
    author,
    genre,
    publisher,
    publication_year,
    copies_available,
  } = req.body;

  const query =
    "INSERT INTO books (title, author, genre, publisher, publication_year, copies_available) VALUES (?, ?, ?, ?, ?, ?);";

  db.query(
    query,
    [title, author, genre, publisher, publication_year, copies_available],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: `Failed to add book: ${err}` });
      } else {
        res.status(201).json({
          message: "Book added successfully",
          bookId: results.insertId,
        });
      }
    }
  );
};

const getBookById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM books WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: `Failed to fetch book with id ${id}` });
    } else if (results.length == 0) {
      res.status(404).json({ error: "Book not found" });
    } else {
      res.status(200).json(results[0]);
    }
  });
};

const updateBookById = (req, res) => {
  const { id } = req.params;
  const {
    title,
    author,
    genre,
    publisher,
    publication_year,
    copies_available,
  } = req.body;

  const query = "SELECT * FROM books WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: `Failed to fetch book with id ${id}` });
    } else if (results.length === 0) {
      res.status(404).json({ error: `Book with id ${id}, not found!` });
    } else {
      const existingBook = results[0];
      const updatedTitle = title || existingBook.title;
      const updatedAuthor = author || existingBook.author;
      const updatedGenre = genre || existingBook.genre;
      const updatedPublisher = publisher || existingBook.publisher;
      const updatedPublicationYear =
        publication_year || existingBook.publication_year;
      const updatedCopiesAvailable =
        copies_available || existingBook.copies_available;

      const updatedQuery =
        "UPDATE books SET title = ?, author = ?, genre = ?, publisher = ?, publication_year = ?, copies_available = ? WHERE id = ?";
      db.query(
        updatedQuery,
        [
          updatedTitle,
          updatedAuthor,
          updatedGenre,
          updatedPublisher,
          updatedPublicationYear,
          updatedCopiesAvailable,
          id,
        ],
        (err, result) => {
          if (err) {
            res
              .status(500)
              .json({ error: `Failed to update book with id ${id}` });
          } else {
            res
              .status(200)
              .json({ message: `Book with id ${id}, updated successfully` });
          }
        }
      );
    }
  });
};

const deleteBookById = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM books WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error while deleting book:", err);
      res.status(500).json({ error: "Failed to delete book" });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ message: "Book not found" });
      } else {
        res.status(200).json({ message: "Book deleted successfully" });
      }
    }
  });
};

const searchBooks = (req, res) => {
  const { title, author, genre, publisher, publication_year } = req.query;

  let query = "SELECT * FROM books WHERE 1=1";
  const params = [];

  if (title) {
    query += " AND title LIKE ?";
    params.push(`%${title.trim().replace(/"/g, "")}%`);
  }

  if (author) {
    query += " AND author LIKE ?";
    params.push(`%${author.trim().replace(/"/g, "")}%`);
  }

  if (genre) {
    query += " AND genre LIKE ?";
    params.push(`%${genre.trim().replace(/"/g, "")}%`);
  }

  if (publisher) {
    query += " AND publisher LIKE ?";
    params.push(`%${publisher.trim().replace(/"/g, "")}%`);
  }

  if (publication_year) {
    query += " AND publication_year LIKE ?";
    params.push(`%${publication_year.trim().replace(/"/g, "")}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      res.status(500).json({ error: "No books were found!" });
    } else {
      res.status(200).json(results);
    }
  });
};

const mostBorrowedBooks = (req, res) => {
  const query =
    "SELECT books.title, COUNT(books.id) as most_borrowed_books FROM books INNER JOIN loans ON books.id = loans.book_id GROUP BY books.title ORDER BY most_borrowed_books DESC";

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send({ error: "Failed to fetch stats!" });
    } else {
      console.log(results);
      res.status(200).send(results);
    }
  });
};

module.exports = {
  getAllBooks,
  addNewBook,
  getBookById,
  updateBookById,
  deleteBookById,
  searchBooks,
  mostBorrowedBooks,
};
