const blogRouter = require("express").Router();
const { response } = require("../app");
const Blog = require("../models/blog");
const { error } = require("../utils/logger");

const errorHandler = require("../utils/middleware");
const User = require("../models/usersSchema");
const jwt = require("jsonwebtoken");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username",
      },
    });
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  try {
    const body = request.body;
    if (!request.token) {
      response.status(401).json({ error: "token missing or invalid" });
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    const user = request.user;

    const newBlog = new Blog({
      title: request.body.title,
      author: request.body.author,
      user: user._id,
      content: request.body.content,
      likes: request.body.likes,
    });
    const { title, content } = request.body;

    if (!title || !content) {
      return response.status(400).json({ error: "Title and URL are required" });
    }
    const result = await newBlog.save();
    user.blogs = user.blogs.concat(result);
    await user.save();
    response.status(201).json(result);
  } catch {
    response.status(401);
  }
});

blogRouter.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }
    const user = request.user;
    const blogToDelete = await Blog.findById(id);
    if (blogToDelete.user.toString() !== decodedToken.id) {
      return response
        .status(403)
        .json({ error: "Unauthorized to delete this blog" });
    }
    const { deletedCount } = await Blog.deleteOne({ _id: id });

    if (deletedCount === 0) {
      return response.status(404).json({ error: "Blog not found" });
    }

    await Blog.findByIdAndRemove(request.params.id);
    user.blogs = user.blogs.filter(
      (blogId) => blogId.toString() !== request.params.id
    );
    await user.save();

    // Retrieve the updated user object with the populated blogs
    await user.populate("blogs");

    response.status(204).end();
  } catch (e) {}
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
    content: req.body.content,
    likes: req.body.likes,
  };
  let updateBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog, {
    new: true,
  });
  res.json(updateBlog);
});

blogRouter.post("/:id/comments", async (request, response) => {
  try {
    const { id } = request.params;
    const { commentText } = request.body;

    if (!commentText) {
      return response.status(400).json({ error: "Comment is required" });
    }

    // Get the user making the comment from the request object (assuming you've set the user in an earlier middleware)
    const user = request.user;
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $push: { comments: { text: commentText, user: user._id } } },
      { new: true }
    ).populate("comments.user", "username"); // Populate the user field in the comment with the user's username
    if (!updatedBlog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    response.status(200).json(updatedBlog);
  } catch (error) {
    console.log(error);
  }
});
module.exports = blogRouter;
