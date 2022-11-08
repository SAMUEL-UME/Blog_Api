const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { SECRET } = require("../config/config");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, SECRET, async (err, decodedToken) => {
      if (err) {
        res.json({ ERROR: err });
      } else {
        const user = await User.findById(decodedToken.id);
        req.user = user;
        next();
      }
    });
  } else {
    res.status(302).redirect("/blogospot/login");
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
