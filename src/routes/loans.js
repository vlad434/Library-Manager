const express = require("express");
const router = express.Router();
const loansController = require("../controllers/loansController");

router.get("/", loansController.getAllLoans);

module.exports = router;
