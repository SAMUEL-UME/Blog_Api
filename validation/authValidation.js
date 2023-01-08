const joi = require("joi");

const signUpSchema = joi.object({
  first_name: joi.string().trim().required(),
  last_name: joi.string().trim().required(),
  username: joi.string().trim().required(),
  email: joi
    .string()
    .trim()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi
    .string()
    .trim()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});

//validation
const validateSignup = async (req, res, next) => {
  const { error } = await signUpSchema.validate(req.body);
  if (error) {
    next(error.message);
  } else {
    next();
  }
};

//Login validation

const loginSchema = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi.string().required(),
});

const validateLogin = async (req, res, next) => {
  const { error } = await loginSchema.validate(req.body);
  if (error) {
    next(error.message);
  } else {
    next();
  }
};
module.exports = { validateLogin, validateSignup };

