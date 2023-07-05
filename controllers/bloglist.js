const blogRouter = require("express").Router();
const { response } = require("../app");
const blog = require("../models/blog");
const Blog = require("../models/blog");
require("express-async-errors");
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

blogRouter.get("/:id", async (request, response) => {
  const blogToBeSent = await Blog.findById(request.params.id);

  response.json(blogToBeSent);
});

blogRouter.put("/:id", async (req, res) => {
  const newBlog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
  };
  console.log(newBlog);
  let updateBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog, {
    new: true,
  });
  console.log(updateBlog);
  res.json(updateBlog);
});

module.exports = blogRouter;
