const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: {
    type: String,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
});
blogSchema.set("toJSON", {
  transform: (document, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});
module.exports = mongoose.model("Blog", blogSchema);
