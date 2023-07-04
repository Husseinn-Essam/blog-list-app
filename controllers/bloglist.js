const blogRouter = require("express").Router();
const Blog = require("../models/blog");
//require("express-async-errors");
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

module.exports = blogRouter;
