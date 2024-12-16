const express = require("express");
const router = express.Router();
const loansController = require("../controllers/loansController");

router.get("/", loansController.getAllLoans);
router.post("/", loansController.addLoan);
router.get("/:id", loansController.getLoanById);
router.put("/:id", loansController.updateLoan);
router.delete("/:id", loansController.deleteLoan);

module.exports = router;
