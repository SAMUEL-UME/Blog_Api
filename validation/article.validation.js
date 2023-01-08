const joi = require("joi");

const BlogSchema = joi.object({
  title: joi.string().min(5).trim().required(),
  description: joi.string().min(10).trim().optional(),
  tags: joi.string().required(),
  body: joi.string().min(50).trim().required(),
});

const validateBlog = async (req, res, next) => {
  const { error } = await BlogSchema.validate(req.body);
  if (error) {
    next(error.message);
  } else {
    next();
  }
};

module.exports = validateBlog;
