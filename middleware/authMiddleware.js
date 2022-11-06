const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { SECRET } = require("../config/config");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check jason web token exist & verified
  if (token) {
    jwt.verify(token, SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        const user = await User.findById(decodedToken.id);
        req.user = user;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

//check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, SECRET, async (err, decodedToken) => {
      if (err) {
        req.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        console.log(user._id);
        req.user = user;
        next();
      }
    });
  } else {
    req.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
