const express = require("express");
const Database = require("./database/index");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const {PORT} = require("./config/config")

// Database connection
Database.connect();

const app = express();


//midlleware
app.use(express.json());
app.use(cookieParser());

app.get("*", checkUser);
app.get("/", (req, res) => {
  res.json({ mssg: "welcome to my home page" });
});
// Settting up the routes
app.use("/blogospot", authRoutes); //User routes
app.use("/blogospot",blogRoutes); //Blog routes

//setting a 404 page
app.get("*", function (req, res) {
  res
    .status(404)
    .send("Oops! You are lost.\nWe can not find the page you are looking for.");
});

//Catch error
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Ohh no something went wrong!";
  res.status(statusCode).json({ error: "Something went wrong", err });
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
