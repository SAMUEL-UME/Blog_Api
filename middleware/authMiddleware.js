const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { SECRET } = require("../config/config");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, SECRET, async (err, decodedToken) => {
      if (err) {
        next(err.message);
        // console.log(err.message);
      } else {
        const user = await User.findById(decodedToken.id);
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({ status: false, data: "Not authorized" });
  }
};

//check current user
const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  const { authorization } = req.headers;
  console.log(authorization);

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
  // if (!authorization) {
  //   return res.status(401).json({ error: "Authorization  token is required" });
  // }
  // const token = authorization.split(" ")[1];
  // try {
  //   const { _id } = jwt.verify(token, SECRET);
  //   req.user = await User.findOne({ _id }).select("_id");
  //   // console.log("*******E dey sweet******")
  //   console.log(req.user);
  //   next();
  // } catch (error) {
  //   next();
  //   // console.log(error);
  //   // res.status(401).json({ error: "Request is not authorized" });
  // }
};

module.exports = { requireAuth, checkUser };


// const requireAuth = async (req, res, next) => {
//   //verify authentication
//   const { authorization } = req.headers;

//   if (!authorization) {
//     return res.status(401).json({ error: "Authorization  token is required" });
//   }
//   const token = authorization.split(" ")[1];
//   try { 
//     const { _id } = jwt.verify(token, process.env.SECRET);
//     req.user = await User.findOne({ _id }).select("_id");
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ error: "Request is not authorized" });
//   }
// };

// module.exports = requireAuth;
