const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3 },
  name: { type: String },
  passwordHash: { type: String, required: true, minlength: 3 },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
});
userSchema.plugin(uniqueValidator);
userSchema.set("toJSON", {
  transform: (document, obj) => {
    obj.id = obj._id?.toString();
    delete obj._id;
    delete obj.__v;
    delete obj.passwordHash;
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
