const supertest = require("supertest");
const { initialBlogs } = require("./helper");
require("express-async-errors");
const app = require("../app");
const Blog = require("../models/blog");
const blog = require("../models/blog");
const api = supertest(app);
beforeAll(async () => {
  await require("../setup")();
});
beforeEach(async () => {
  await Blog.deleteMany({});
  await blog.insertMany(initialBlogs);
});
afterAll(async () => {
  await require("../setup").stop();
});

describe("get blogs", () => {
  test("get blogs in json format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 10000);
  test("get right amount of blogs", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test("returned blogs has id field", async () => {
    const response = await api.get("/api/blogs");
    if (response.body.length > 0) {
      expect(response.body[0].id).toBeDefined();
    }
  });
});

describe("post blog", () => {
  const newBlog = {
    title: "gamers.js is the best framework fr fr",
    author: "trustmebro",
    url: "http://www.real.html",
    likes: 1,
  };

  test("the new blog is added to database", async () => {
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    const title = response.body.map((r) => r.title);
    expect(response.body.length).toBe(initialBlogs.length + 1);
    expect(title).toContain("gamers.js is the best framework fr fr");
  });

  test("blog like field should be zero by default", async () => {
    const noLikesBlog = {
      title: "gamers.js is the best framework fr fr",
      author: "trustmebro",
      url: "http://www.real.html",
    };
    const response = await api.post("/api/blogs").send(noLikesBlog);
    expect(response.body.likes).toBe(0);
  });

  test(" status 400 if blog url and title are missing", async () => {
    const invalidBlog = {
      author: "trustmebro",
      likes: 0,
    };
    await api.post("/api/blogs").send(invalidBlog).expect(400);
  });
});
