require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

module.exports = {
  MONGO_URL,
  PORT,
  SECRET,
};
