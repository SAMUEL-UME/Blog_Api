const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/config");
const { handleErrors } = require("../validation/customErrorHandler");
const { maxAge } = require("../utils/utils");

const createToken = (id) => {
  return jwt.sign({ id }, SECRET, {
    expiresIn: maxAge,
  });
};
//controller action
module.exports.signup_post = async (req, res) => {
  try {
    const data = await User.create(req.body);
    const token = createToken(data._id);
    const { password, ...user } = data._doc;
    delete user.password;
    res.status(201).json({ status: true, user, token });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ status: false, error });
  }
};

module.exports.login_post = async (req, res) => {
  try {
    const data = await User.login(req.body);
    const token =createToken(data._id);
    const { password, ...user } = data._doc;
    delete user.password;
    delete user.password;
    res.status(200).json({ status: true, user, token });
  } catch (error) {
    res.status(400).json({ status: false, error: "Incorrect credentials" });
  }
};

module.exports.log_out = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ Response: "You have signed out succesfully" });
};
