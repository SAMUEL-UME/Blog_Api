const { Router } = require("express");
const blogController = require("../controller/blogController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

//Users blog
router.get("/user/blogs", requireAuth, blogController.userBlogs);

//create blog
router.post("/newblog", requireAuth, blogController.createBlog);

// get single blog by id
router.get("/:id",  blogController.getOnePublishedBlog);
// not logged in and logged in user



//Get a published blog
router.get("/blogs", blogController.getAllPublishedBlog);


//Get all published blogs by all user -paginated 20 - searchable by author ,title and tags  oderable read_count read_time timestamp

//Update ablog by user
router.patch("/update/:id", requireAuth, blogController.updatePost);

//delete a blog by user
router.delete("/delete/:id", requireAuth, blogController.deletePost);


module.exports = router;
