const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/config");
const handleErrors = require("../validation/customErrorHandler");
const { maxAge } = require("../utils/utils");




const createToken = (id) => {
  return jwt.sign({ id }, SECRET, {
    expiresIn: maxAge,
  });
};
//controller action
module.exports.signup_post = async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;
  try {
    const user = await User.create({
      first_name,
      last_name,
      username,
      email,
      password,
    });
    const token = await createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ status: true, data: user });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ status: false, errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = await createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ status: true, data: user });
  } catch (error) {
    console.log(err.message);
    const errors = handleErrors(error);
    res.status(400).json({ status: false, error: errors });
  }
};

module.exports.log_out = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res
    .status(200)
    .json({ Response: "You have signed out succesfully" })
    .redirect("/");
};
