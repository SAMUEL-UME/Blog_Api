const Article = require("../model/article");
const User = require("../model/user");
const { readTime } = require("../utils/utils");

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);

  let errors = {
    title: "",
    body: "",
  };

  if (err.code === 11000) {
    if (err.message.includes("test.articles index: title_1 dup key")) {
      errors.title = "Title already exist";
      return errors;
    }
  }
  if (err.message.includes("Article validation failed")) {
    console.log(Object.values(err.errors));
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

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
    const errors = handleErrors(err);
    res.status(400).json({ status: false, error: errors });
  }
};

// get a signpost by id
module.exports.getOnePublishedBlog = async (req, res) => {
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
    res.status(400).json({ status: false, error: "An error occured" });
  }
};

//Get all published blog
module.exports.getAllPublishedBlog = async (req, res) => {
  console.log("------you made it");
  const { query } = req;

  const { auth, title, tags, read_count, reading_time, p } = query;

  console.log(query);
  console.log(auth);
  let author;

  if (auth) {
    const user = await User.find({ username: auth });

    if (user) {
      author = user[0]._id;
      console.log(author);
    }
  }
  const page = p || 0;

  const blogPerPage = 20;

  if (title) {
    findQuery.title = title;
  }

  const findQuery = { state: "published" };
  const setQuery = { updatedAt: -1, createdAt: 1 };

  // if author exist
  if (author) {
    findQuery.author = author;
  }
  //if tags exist it will run
  if (tags) {
    findQuery.tags = tags;
  }

  if (read_count) {
    setQuery.read_count = 1;
  }

  if (reading_time) {
    setQuery.reading_time = 1;
  }

  try {
    const blogs = await Article.find(findQuery)
      .populate("author", {
        username: 1,
      })
      .sort(setQuery)
      .skip(page * blogPerPage)
      .limit(blogPerPage);

    if (blogs) {
      console.log(blogs);
      console.log("This wass successful");
      res.status(200).json({ state: true, data: blogs });
    } else {
      throw new Error("No matches was found");
    }
  } catch (err) {
    res.status(400).json({ error: "An error occured please try again" });
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
    console.log(blogId);

    if (user === blogAuthor) {
      const updatedBlog = await Article.findByIdAndUpdate(id, {
        ...req.body,
      });
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
    console.log(blogId);

    if (user === blogAuthor) {
      const deletedBlog = await Article.findByIdAndDelete(id);
      console.log(deletedBlog);
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
  console.log(req.user._id.toString());

  const userId = req.user._id.toString();

  try {
    const { query } = req;
    const { state, p } = query;

    const page = p || 0;

    const blogPerPage = 20;

    const findQuery = { author: userId };

    if (state) {
      findQuery.state = state;
    }

    const blogs = await Article.find(findQuery)
      .populate("author", { username: 1 })
      .sort("asc")
      .skip(page * blogPerPage)
      .limit(blogPerPage);

    if (blogs) {
      res.status(200).json({ status: true, data: blogs });
    } else {
      res
        .status(200)
        .json({ status: true, data: "You have no published blog yet" });
    }
  } catch (err) {
    res.status(401).json({
      status: false,
      err: err,
    });
  }
};
