const blogRouter = require("express").Router();
const { response } = require("../app");
const blog = require("../models/blog");
const Blog = require("../models/blog");
const { error } = require("../utils/logger");
const asyncHandler = require("express-async-errors");
const errorHandler = require("../utils/middleware");

blogRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  const { title, url } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: "Title and URL are required" });
  }
  const result = await blog.save();

  response.status(201).json(result);
});

blogRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;
  const { deletedCount } = await Blog.deleteOne({ _id: id });

  if (deletedCount === 0) {
    return response.status(404).json({ error: "Blog not found" });
  }

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
