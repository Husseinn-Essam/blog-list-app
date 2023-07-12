const supertest = require("supertest");
const { initialBlogs } = require("./helper");
require("express-async-errors");
const app = require("../app");
const Blog = require("../models/blog");
const blog = require("../models/blog");
const api = supertest(app);
describe("creating users", () => {
  test("creating a user with a short username returns 400", async () => {
    const newUser = {
      username: "ab",
      name: "gmaer",
      password: "password123",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)
      .expect({
        error: "Username and password must be at least 3 characters long",
      });
  }, 10000);
});
