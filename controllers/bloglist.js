const blogRouter = require("express").Router();
const { response } = require("../app");
const Blog = require("../models/blog");
const { error } = require("../utils/logger");
const asyncHandler = require("express-async-errors");
const errorHandler = require("../utils/middleware");
const User = require("../models/usersSchema");
const jwt = require("jsonwebtoken");
blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const newBlog = new Blog({
    title: request.body.title,
    author: request.body.author,
    user: user._id,
    url: request.body.url,
    likes: request.body.likes,
  });
  const { title, url } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: "Title and URL are required" });
  }
  const result = await newBlog.save();
  user.blogs = user.blogs.concat(result);
  await user.save();
  response.status(201).json(result);
});

blogRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  const blogToDelete = await Blog.findById(id);
  if (blogToDelete.user.toString() !== decodedToken.id) {
    return response
      .status(403)
      .json({ error: "Unauthorized to delete this blog" });
  }
  if (deletedCount === 0) {
    return response.status(404).json({ error: "Blog not found" });
  }
  const { deletedCount } = await Blog.deleteOne({ _id: id });

  await Blog.findByIdAndRemove(request.params.id);
  user.blogs = user.blogs.filter(
    (blogId) => blogId.toString() !== request.params.id
  );
  await user.save();

  // Retrieve the updated user object with the populated blogs
  const updatedUser = await User.findById(decodedToken.id).populate("blogs");

  response.status(204).end();
});

blogRouter.get("/:id", async (request, response, next) => {
  try {
    const blogToBeSent = await Blog.findById(request.params.id);
    if (blogToBeSent) {
      response.json(blogToBeSent);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    errorHandler(error, request, response, next);
  }
});

blogRouter.put("/:id", async (req, res) => {
  const newBlog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
  };
  let updateBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog, {
    new: true,
  });
  res.json(updateBlog);
});

module.exports = blogRouter;
