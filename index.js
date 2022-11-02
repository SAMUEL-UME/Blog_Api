const express = require("express");
const Database = require("./database/index");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

require("dotenv").config();

// Database connection
Database.connect();

const app = express();

//env variables
let port = process.env.PORT;

//midlleware
app.use(express.json());
app.use(cookieParser());

// Settting up the routes
app.use(authRoutes);

app.get("/", (req, res) => {
  res.json({ mssg: "welcome" });
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
