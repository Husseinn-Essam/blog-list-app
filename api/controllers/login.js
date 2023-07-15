const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const loginRouter = require("express").Router();
const User = require("../models/usersSchema");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const correctPass = await bcrypt.compare(password, user.passwordHash);
    if (!correctPass) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };
    const token = jwt.sign(userForToken, process.env.SECRET);

    res
      .status(200)
      .send({ token, username: user.username, name: user.name, id: user._id });
  } catch (e) {
    console.error("An error occurred during login:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = loginRouter;
