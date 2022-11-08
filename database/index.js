const mongoose = require("mongoose");
require("dotenv").config();
const { MONGO_URL } = require("../config/config");

// const mongoURL = process.env.MONGO_URL;

const connect = () => {
  mongoose
    .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Database is connected and ready to go!");
    })
    .catch((error) => {
      console.log("Opps an error occured", error);
    });
};

module.exports = {
  connect,
};
