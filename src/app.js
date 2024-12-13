const express = require("express");
const app = express();
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");
const loanRoutes = require("./routes/loans");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/loans", loanRoutes);

app.get("/", (req, res) => {
  res.status(200);
  res.send("Welcome to my server");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
