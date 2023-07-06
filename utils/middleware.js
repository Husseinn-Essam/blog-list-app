const logger = require("./logger");
const mongoose = require("mongoose");
const errorHandler = (error, request, response, next) => {
  logger.error(error);
  console.log(error);
  console.log("hi");
  if (error instanceof mongoose.Error.CastError && error.kind === "ObjectId") {
    console.log("we got here");
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: error.message });
  }
  console.log("we are here");
  next(error);
};
const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }

  next();
};
module.exports = { errorHandler, tokenExtractor };
