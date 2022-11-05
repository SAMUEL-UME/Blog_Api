const Article = require("../model/article");
const { readTime } = require("../utils/utils");

module.exports.createBlog = async (req, res, next) => {
  const { title, description, tags, body } = req.body;
  try {
    //creating a new blog
    const blog = await Article.create({
      title,
      tags,
      description: description || title,
      author: await req.user._id,
      body,
      reading_time: readTime(body),
    });
    res.status(201).json({ status: true, data: blog });
  } catch (err) {
    res.status(400).json({ status: false, error: err });
    console.log(err, "Opps soemthing went wrong");
  }
};




// get a signpost by id
module.exports.getOnePublishedBlog = async (req, res, next) => {
  try {
    // Get blog blog by state
    const { id } = req.params;
    const blog = await Article.findById(id).populate("author", { username: 1 });

    console.log(blog.author.username);

    if (blog.state !== "published") {
      return res.status(403).json({
        status: false,
        error: "Requested article is not published",
      });
    }

    // update blog read count
    blog.read_count += 1;
    await blog.save();

    return res.json({
      status: true,
      data: blog,
    });
  } catch (err) {
    err.source = "get published blog controller";
    next(err);
  }
};

//Get all published blog
module.exports.getAllPublishedBlog = async (req, res, next) => {};

//update a blog
module.exports.updatePost = async (req, res, next) => {
  const user = req.user.username;
  try {
    const { id } = req.params;
    const blog = await Article.findById(id).populate("author", { username: 1 });
    const blogAuthor = blog.author.username;
    const blogId = blog.id;
    console.log(blogId);

    if (user === blogAuthor) {
      const updatedBlog = await Article.findByIdAndUpdate(id, {
        ...req.body,
      });
      res
        .status(200)
        .json({ status: true, message: "user updated", updatedBlog });
    } else {
      throw new Error("Opps You can't update this post");
    }
  } catch (err) {
    res.status(400).json({ error: err });

    console.log(err);
  }
};


//delete a log
module.exports.deletePost = async (req, res, next) => {
  const user = req.user.username;
  try {
    const { id } = req.params;
    const blog = await Article.findById(id).populate("author", { username: 1 });
    const blogAuthor = blog.author.username;
    const blogId = blog.id;
    console.log(blogId);

    if (user === blogAuthor) {
      const deletedBlog = await Article.findByIdAndDelete(id);
      console.log(deletedBlog);
      res
        .status(200)
        .json({ status: true, message: "This blog was deleted", deletedBlog });
    } else {
      throw new Error("Opps You can't update this post");
    }
  } catch (err) {
    // res.status(400).json({ error : err });
    console.log(err);
    next(err);
  }
};
