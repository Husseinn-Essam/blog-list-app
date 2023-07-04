const supertest = require("supertest");

const app = require("../app");
const Blog = require("../models/blog");
const api = supertest(app);
beforeAll(async () => {
  await require("../setup")();
});
afterAll(async () => {
  await require("../setup").stop();
});

describe("get blogs", () => {
  test.only("get blogs in json format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 10000);
  test.only("get right amount of blogs", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(1);
  });
});
