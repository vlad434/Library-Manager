const express = require("express");
const app = express();
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");
const loanRoutes = require("./routes/loans");

app.use(express.json());
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/loans", loanRoutes);

app.get("/", (req, res) => {
  res.status(200);
  res.send("Welcome to my server");
});

app.listen(3000, (error) => {
  if (!error) {
    console.log("Server is running on port 3000!");
  } else {
    console.log("An error occured: ", error);
  }
});
