const express = require("express");
const app = express();
const Blog = require("./models/blog");
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/bloglist");
const { info, error } = require("./utils/logger");
const config = require("./utils/config");
mongoose.set("strictQuery", false);

info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    info("Connected to DB");
  })
  .catch((e) => {
    error("Error connecting to DB");
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use("/api/blogs", blogRouter);
module.exports = app;
