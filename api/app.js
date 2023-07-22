const express = require("express");
const app = express();
//require("express-async-errors");
const Blog = require("./models/blog");
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/bloglist");
const userRouter = require("./controllers/userRouter");
const loginRouter = require("./controllers/login");
const { info, error } = require("./utils/logger");
const config = require("./utils/config");
const {
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require("./utils/middleware");
mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    info("Connected to DB");
  })
  .catch((e) => {
    error("Error connecting to DB");
  });

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(tokenExtractor);
app.use("/api/blogs", userExtractor);
app.use(errorHandler);
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
module.exports = app;
