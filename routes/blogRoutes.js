const { Router } = require("express");
const blogController = require("../controller/blogController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

//Users blog
router.get("/blogs/user", requireAuth, blogController.userBlogs);

//create blog
router.post("/blog", requireAuth, blogController.createBlog);

//Get a published blog
router.get("/blogs", blogController.getAllPublishedBlog);

// get single blog by id
router.get("/blog/:id", blogController.getOnePublishedBlog);


//Update ablog by user
router.patch("/blog/:id", requireAuth, blogController.updatePost);

//delete a blog by user
router.delete("/blog/:id", requireAuth, blogController.deletePost);

module.exports = router;
