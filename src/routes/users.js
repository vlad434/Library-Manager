const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  mostActiveUser,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  registerUser,
} = require("../controllers/usersController");

router.post("/register", registerUser);

router.get("/", getAllUsers);
router.get("/mostActiveUser", mostActiveUser);
router.get("/:id", getUserById);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
