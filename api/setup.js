//setup for testing backend
const mongoose = require("mongoose");
const Blog = require("./models/blog");

module.exports = async () => {
  const mongoUri = process.env.MONGODB_URI;

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports.stop = async () => {
  await mongoose.disconnect();
};
