const supertest = require("supertest");
const { initialBlogs } = require("./helper");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/usersSchema");
const bcrypt = require("bcryptjs");
const { find } = require("lodash");
const api = supertest(app);
beforeAll(async () => {
  await require("../setup")();
}, 10000);
beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  ////
  const password = "chainsaw";
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = new User({
    username: "johnn2",
    name: "gmaer",
    passwordHash,
  });
  const savedUser = await newUser.save();
  const blogObjects = initialBlogs.map(
    (blog) => new Blog({ ...blog, user: savedUser._id })
  );

  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
  ///
  const loginResponse = await api.post("/api/login").send({
    username: "johnn2",
    password: "chainsaw",
  });
  const token = loginResponse.body.token;
}, 10000);
afterAll(async () => {
  await require("../setup").stop();
}, 100000);

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
    const loginResponse = await api.post("/api/login").send({
      username: "johnn2",
      password: "chainsaw",
    });
    const token = loginResponse.body.token;
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    const title = response.body.map((r) => r.title);
    expect(response.body.length).toBe(initialBlogs.length + 1);
    expect(title).toContain("gamers.js is the best framework fr fr");
  }, 10000);

  test("blog like field should be zero by default", async () => {
    const noLikesBlog = {
      title: "gamers.js is the best framework fr fr",
      author: "trustmebro",
      url: "http://www.real.html",
    };
    const loginResponse = await api.post("/api/login").send({
      username: "johnn2",
      password: "chainsaw",
    });
    const token = loginResponse.body.token;
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(noLikesBlog);
    expect(response.body.likes).toBe(0);
  });

  test(" status 400 if blog url and title are missing", async () => {
    const loginResponse = await api.post("/api/login").send({
      username: "johnn2",
      password: "chainsaw",
    });
    const token = loginResponse.body.token;
    const invalidBlog = {
      author: "trustmebro",
      likes: 0,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(invalidBlog)
      .expect(400);
  });
});

describe("deleting a blog", () => {
  test("delete a blog", async () => {
    const blogToBeDeletedID = initialBlogs[0]._id;
    const loginResponse = await api.post("/api/login").send({
      username: "johnn2",
      password: "chainsaw",
    });
    const token = loginResponse.body.token;

    await api
      .delete(`/api/blogs/${blogToBeDeletedID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
    const response = await api.get("/api/blogs");
    const titles = response.body.map((r) => r.title);
    expect(response.body.length).toBe(initialBlogs.length - 1);
    expect(titles).not.toContain(blogToBeDeletedID.title);
  }, 10000);
});

describe("getting a single blog", () => {
  test("get a blog by its id", async () => {
    await api
      .get(`/api/blogs/${initialBlogs[0]._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("update a blog", () => {
  test("update an existing blog", async () => {
    const blogToUpdate = initialBlogs[0];

    const updatedBlog = {
      title: "Updated Title",
      author: "Updated Author",
      url: "http://updated-url.com",
      likes: 10,
    };

    await api
      .put(`/api/blogs/${initialBlogs[0]._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAfterUpdate = await api.get("/api/blogs");
  }, 100000);
});

describe("token auth", () => {
  test("adding a blog without a token returns 401 Unauthorized", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "http://www.test.com",
      likes: 0,
    };
    const invalidToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYWQiLCJpZCI6IjY0YTcxZDI4OTRlZGNjOWQxMWViMGE3NCIsImlhdCI6MTY4ODY3Mzc3OX0.stRayp1ft2GMp9F6ZQ4R9FKpneAY6rM9O21SEh7Xq5s";
    await api
      .post("/api/blogs")
      .set("Authorization", ` `)
      .send(newBlog)
      .expect(401);
  });
});
