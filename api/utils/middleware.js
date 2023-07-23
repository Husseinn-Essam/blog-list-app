const { request, response } = require("../app");
const logger = require("./logger");
const mongoose = require("mongoose");
const User = require("../models/usersSchema");
const jwt = require("jsonwebtoken");
const errorHandler = (error, request, response, next) => {
  logger.error(error);

  if (error instanceof mongoose.Error.CastError && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }

  next();
};

const userExtractor = async (request, response, next) => {
  const token = request.token;
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (decodedToken.id) {
      const user = await User.findById(decodedToken.id);

      request.user = user;
    }
  }
  next();
};
module.exports = { errorHandler, tokenExtractor, userExtractor };
