const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/taskmanager");

const jwtSecret = "jwt_secret_here";

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded._id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

app.post("/users", async (req, res) => {
  const user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 8);
  await user.save();
  const token = jwt.sign({ _id: user._id }, jwtSecret);
  res.status(201).send({ user, token });
});

app.post("/users/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ _id: user._id }, jwtSecret);
  res.send({ user, token });
});

// Use routes
const routes = require("./routes");
app.use("/api", auth, routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
