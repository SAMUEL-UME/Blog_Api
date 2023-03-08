const express = require("express");
const Database = require("./database");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { checkUser } = require("./middleware/authMiddleware");

const app = express();

//midlleware
// app.use(cors())
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.get("*", checkUser);
app.get("/", (req, res) => {
  res.json({
    mssg: "Hey there, welcome to blogospot.",
  });
});
// Settting up the routes
app.use("/api/v1/blogospot", authRoutes, cors()); //User routes
app.use("/api/v1/blogospot", blogRoutes); //Blog routes

//setting a 404 page
app.get("*", function (req, res) {
  res
    .status(404)
    .send("Oops! You are lost.\nWe can not find the page you are looking for.");
});

//Catch error
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ status: false, error: err });
});

// Database connection
Database.connect(app);
