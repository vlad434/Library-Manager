const db = require("../../db/db");
const bcrypt = require("bcrypt");

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

const getUserById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM users WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch user" });
    } else {
      res.status(200).json(results);
    }
  });
};

const addUser = (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  const query =
    "INSERT INTO users (first_name, last_name, email, phone) VALUES (?, ?, ?, ?);";

  db.query(query, [first_name, last_name, email, phone], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to add user!" });
    } else {
      res.status(200).json({
        message: "User added successfully",
        userId: results.insertId,
      });
    }
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone } = req.body;

  const selectQuery = "SELECT * FROM users WHERE id = ?";
  db.query(selectQuery, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch user!" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      const existingUser = results[0];
      const updatedFirstName = first_name || existingUser.first_name;
      const updatedLastName = last_name || existingUser.last_name;
      const updatedEmail = email || existingUser.email;
      const updatedPhone = phone || existingUser.phone;

      const updateQuery =
        "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?";
      db.query(
        updateQuery,
        [updatedFirstName, updatedLastName, updatedEmail, updatedPhone, id],
        (err, results) => {
          if (err) {
            res.status(500).json({ error: "Failed to update user!" });
          } else {
            res.status(200).json({ message: "User updated successfully!" });
          }
        }
      );
    }
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM users WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to delete user!" });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json({ message: "User deleted successfully" });
      }
    }
  });
};

const mostActiveUser = (req, res) => {
  const query =
    "SELECT users.first_name, COUNT(loans.user_id) as times_was_active FROM users INNER JOIN loans ON users.id = loans.user_id GROUP BY users.first_name ORDER BY times_was_active DESC";

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch stats", err });
    } else {
      res.status(200).json(results);
    }
  });
};

const registerUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";

  db.query(checkEmailQuery, [email], async (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error during email check", err });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Email already in use!" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 8);

      const insertQuery =
        "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";

      db.query(
        insertQuery,
        [first_name, last_name, email, hashedPassword],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error registering user!", err });
          }
          return res
            .status(201)
            .json({ message: "User registered successfully" });
        }
      );
    } catch (error) {
      return res.status(500).json({ error: "Error hashing password!", error });
    }
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  mostActiveUser,
  registerUser,
};
