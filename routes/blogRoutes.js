const { Router } = require("express");
const blogController = require("../controller/blogController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

//create blog
router.post("/newblog", requireAuth, blogController.createBlog);

// not logged in and logged in user
// get single blog by id

//Get a published blog
router.get("/:id", requireAuth, blogController.getOnePublishedBlog);

//Get all published blogs by all user -paginated 20 - searchable by author ,title and tags  oderable read_count read_time timestamp

//Update ablog by user
router.patch("/update/:id", requireAuth, blogController.updatePost);

//delete a blog by user
router.delete("/delete/:id", requireAuth, blogController.deletePost);

// get all blog -user

module.exports = router;
