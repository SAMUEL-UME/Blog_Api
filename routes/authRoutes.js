const { Router } = require("express");
const authController = require("../controller/authController");
const {validateSignup,validateLogin} = require("../validation/authValidation");

const router = Router();



router
  .route("/signup")
  .post(validateSignup, authController.signup_post);
router
  .route("/login")
  .post(validateLogin, authController.login_post);
module.exports = router;
