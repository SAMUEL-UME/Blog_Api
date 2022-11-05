const jwt = require("jsonwebtoken");
const User = require("../model/user");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check jason web token exist & verified
  if (token) {
    jwt.verify(token, "net ninja secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        const user = await User.findById(decodedToken.id);
        req.user = user;
        console.log(user);
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
    jwt.verify(token, "net ninja secret", async (err, decodedToken) => {
      if (err) {
         req.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        console.log(user);
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
