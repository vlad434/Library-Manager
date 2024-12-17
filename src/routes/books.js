const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

router.get("/", booksController.getAllBooks);
router.get("/search", booksController.searchBooks);
router.get("/mostBorrowedBooks", booksController.mostBorrowedBooks);
router.get("/:id", booksController.getBookById);
router.put("/:id", booksController.updateBookById);
router.post("/", booksController.addNewBook);
router.delete("/:id", booksController.deleteBookById);

module.exports = router;
