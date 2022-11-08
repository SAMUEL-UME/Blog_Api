const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/config");

// handle errors
const handleErrors = (err) => {
  let errors = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  };
  //incorrect email when loggin in
  if (err.message === "Incorrect email") {
    errors.email = "That email is not registered ";
  }
  //incorrect password when loggin in
  if (err.message === "Incorrect password") {
    errors.password = "That password is not registered";
  }

  if (err.code === 11000) {
    if (err.message.includes("index: email_1 ")) {
      errors.email = "Email is already registered";
      return errors;
    }
    if (err.message.includes("index: username_1")) {
      errors.username = "username already exist, try another";
    }
  }
  // validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

//creating token
const maxAge = 1 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, SECRET, {
    expiresIn: maxAge,
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.send("signup");
};

module.exports.login_get = (req, res) => {
  res.send("Heyy there, Login in to your account");
};

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
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ status: false, error: errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
  
    const token = await createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ status: true, data: user });
  } catch (err) {
    const errors = handleErrors(err);
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
