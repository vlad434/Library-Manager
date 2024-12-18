const express = require("express");
const router = express.Router();
const loansController = require("../controllers/loansController");

router.get("/", loansController.getAllLoans);
router.get("/search", loansController.searchLoans);
router.post("/", loansController.addLoan);
router.get("/:id", loansController.getLoanById);
router.put("/:id", loansController.updateLoan);
router.delete("/:id", loansController.deleteLoan);
router.patch("/:id/return", loansController.returnLoan);

module.exports = router;
