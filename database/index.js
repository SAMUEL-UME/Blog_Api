const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.MONGO_URL;

const connect = () => {
  mongoose
    .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Database is cennected and ready to go!");
    })
    .catch((error) => {
      console.log("Opps an error occured", error);
    });
};

module.exports = {
  connect,
};
