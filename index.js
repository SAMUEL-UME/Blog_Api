const express = require("express");
const Database = require("./database/index");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

require("dotenv").config();

// Database connection
Database.connect();

const app = express();

//env variables
let port = process.env.PORT;

//midlleware
app.use(express.json());
app.use(cookieParser());

app.get("*", checkUser);
app.get("/", (req, res) => {
  console.log(req.user)
  res.json({ mssg: "welcome to my home page" });
});
app.get("/blogospot", requireAuth, (req, res) => {
  console.log(req.user);
  res.json({
    mssg: "Hey there, welcome to the best blogging plateform about the tech industry you'll find everywhere",
  });
});

// Settting up the routes
app.use(authRoutes); //User routes
app.use(blogRoutes); //Blog routes

//setting a 404 page

//Catch error

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
