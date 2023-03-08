const mongoose = require("mongoose");
require("dotenv").config();
const { MONGO_URL } = require("../config/config");


const { PORT } = require("../config/config");

// const mongoURL = process.env.MONGO_URL;

const connect = (app) => {
  mongoose
    .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Database is connected and ready to go!");
      app.listen(PORT, () => {
        console.log(`Server is up and running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.log("Opps an error occured", error);
    });
};

module.exports = {
  connect,
};
