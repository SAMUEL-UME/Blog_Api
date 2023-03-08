const Article = require("../model/article");
const User = require("../model/user");
const { readTime } = require("../utils/utils");
const { handleBlogErrors } = require("../validation/customErrorHandler");

// handle errors

module.exports.createBlog = async (req, res) => {
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
    const errors = handleBlogErrors(err);
    res.status(400).json({ status: false, error: errors });
  }
};

// get a signpost by id
module.exports.getOnePublishedBlog = async (req, res) => {
  try {
    // Get blog blog by state
    const { id } = req.params;
    const blog = await Article.findById(id).populate("author", { username: 1 });

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
    res.status(400).json({ status: false, error: "An error occured" });
  }
};

//Get all published blog
module.exports.getAllPublishedBlog = async (req, res) => {
  const { query } = req;

  const { auth, title, tags, read_count, p } = query;

  let author;

  if (auth) {
    const user = await User.find({ username: auth });
    if (user) {
      try {
        author = user[0]._id;
      } catch (err) {
        return res.status(400).json({
          status: "flase",
          error: "User name does not exist in database",
        });
      }
    }
  }
  const page = Number(p) || 0;
  // console.log(p);

  const blogPerPage = 20;

  const findQuery = { state: "published" };
  const setQuery = { createdAt: -1 };

  // if author exist
  if (author) {
    findQuery.author = author;
  }
  //if tags exist it will run
  if (tags) {
    const list = tags.split(",").map((s) => s.trim());
    if (list.length >= 2) {
      findQuery.tags = { $all: list };
    } else {
      findQuery.tags = tags;
    }
  }

  if (title) {
    findQuery.title = { $regex: title, $options: "i" };
  }
  if (read_count) {
    setQuery.read_count = 1;
  }

  try {
    const blogs = await Article.find(findQuery)
      .populate("author", {
        username: 1,
      })
      .sort(setQuery)
      .skip(page * blogPerPage)
      .limit(blogPerPage);

    if (blogs.length >= 1) {
      res.status(200).json({ state: true, data: blogs });
    } else if (blogs.length <= 0) {
      return res
        .status(404)
        .json({ state: true, data: "No blog matches your search" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ state: true, error: "An error occured please try again", err });
  }
};

//update a blog
module.exports.updatePost = async (req, res) => {
  const user = req.user.username;
  try {
    const { id } = req.params;
    const blog = await Article.findById(id).populate("author", { username: 1 });
    const blogAuthor = blog.author.username;
    const blogId = blog.id;

    if (user === blogAuthor) {
      const updatedBlog = await Article.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true, runValidators: true }
      );
      res
        .status(200)
        .json({ status: true, message: "This blog was updated", updatedBlog });
    } else {
      throw new Error("Opps you're not authorized to update this post");
    }
  } catch (err) {
    res
      .status(401)
      .json({ error: "You're not authorized to updated this a post" });
  }
};

//delete a log
module.exports.deletePost = async (req, res) => {
  const user = req.user.username;
  try {
    const { id } = req.params;
    const blog = await Article.findById(id).populate("author", { username: 1 });
    const blogAuthor = blog.author.username;
    const blogId = blog.id;

    if (user === blogAuthor) {
      const deletedBlog = await Article.findByIdAndDelete(id);
      res.status(200).json({
        status: true,
        message: "This blog was deleted",
        data: deletedBlog,
      });
    } else {
      throw new Error("Opps You can't update this post");
    }
  } catch (err) {
    res.status(401).json({ error: "You're not autorized" });
  }
};

module.exports.userBlogs = async (req, res) => {
  const userId = req.user._id.toString();
  try {
    const { query } = req;
    const { state, p } = query;

    const page = p || 0;

    const blogPerPage = 10;

    const findQuery = { author: userId };

    if (state) {
      findQuery.state = state;
    }
    // const { authorization } = req.headers;
    // console.log(req.headers);

    const blogs = await Article.find(findQuery)
      .populate("author", { username: 1 })
      .sort("asc")
      .skip(page * blogPerPage)
      .limit(blogPerPage);

    if (blogs.length >= 1) {
      res.status(200).json({ status: true, data: blogs });
    } else {
      res
        .status(200)
        .json({ status: true, data: "You have no blog yet blog yet" });
    }
  } catch (err) {
    res.status(401).json({
      status: false,
      err: "Opps, Something went wrong",
    });
  }
};
