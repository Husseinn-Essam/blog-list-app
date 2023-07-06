const express = require("express");
const app = express();
//require("express-async-errors");
const Blog = require("./models/blog");
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/bloglist");
const userRouter = require("./controllers/userRouter");
const { info, error } = require("./utils/logger");
const config = require("./utils/config");
const errorHandler = require("./utils/middleware");
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

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(errorHandler);
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
module.exports = app;
