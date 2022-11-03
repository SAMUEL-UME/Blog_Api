const User = require("../model/user");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
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
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

//creating token
const maxAge = 3 * 60 * 60;
const createToken = (id) => {
  console.log("We made you a webtoken");
  return jwt.sign({ id }, "net ninja secret", {
    expiresIn: maxAge,
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.send("signup");
};

module.exports.login_get = (req, res) => {
  res.send("login");
};

module.exports.signup_post = async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;
  console.log("hello u 2 got here");

  try {
    const user = await User.create({
      first_name,
      last_name,
      username,
      email,
      password,
    });
    const token = await createToken(user._id);
    console.log(token);
    console.log(user._id);
    res.cookie("###", token, { httpOnly: true, maxAge: maxAge * 1000 });
    console.log("we made you a webtoken");
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    console.log(password);
    const token = await createToken(user._id);
    res.cookie("###", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, mssg: "you're logged in" });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.log_out = (req, res) => {
  res.cookie("###", "", { maxAge: 1 });
  res.send("You have logged out succesfully");
};

module.exports.logout_get = async (req, res) => {};
