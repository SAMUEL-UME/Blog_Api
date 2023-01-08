const { Router } = require("express");
const blogController = require("../controller/blogController");
const { requireAuth } = require("../middleware/authMiddleware");
const validateBlog = require("../validation/article.validation");

const router = Router();

//Users blog
router.get("/blogs/user", requireAuth, blogController.userBlogs);

router
  .route("/blogs")
  .get(blogController.getAllPublishedBlog)
  .post(requireAuth, validateBlog, blogController.createBlog);

router
  .route("/blogs/:id")
  .get(blogController.getOnePublishedBlog)
  .patch(requireAuth, blogController.updatePost)
  .delete(requireAuth, blogController.deletePost);
// get single blog by id

module.exports = router;
