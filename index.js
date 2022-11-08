const express = require("express");
const Database = require("./database/index");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const cookieParser = require("cookie-parser");
const {  checkUser } = require("./middleware/authMiddleware");

const { PORT } = require("./config/config");

// Database connection
Database.connect();

const app = express();

//midlleware
app.use(express.json());
app.use(cookieParser());

app.get("*", checkUser);
app.get("/", (req, res) => {
  res.json({
    mssg: "Hey there, welcome to the best blogging plateform about the tech industry you'll find everywher",
  });
});
// Settting up the routes
app.use("/blogospot", authRoutes); //User routes
app.use("/blogospot", blogRoutes); //Blog routes

//setting a 404 page
app.use((err, req, res, next) => {
  res.status(500).send("Something broke!");
});


//Catch error
app.get("*", function (req, res) {
  res
    .status(404)
    .send("Oops! You are lost.\nWe can not find the page you are looking for.");
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
