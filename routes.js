const express = require("express");
const router = express.Router();
const Task = require("./models/task");
const Category = require("./models/category");

router.post("/tasks", async (req, res) => {
  const task = new Task({
    ...req.body,
    user: req.user._id,
  });
  await task.save();
  res.status(201).send(task);
});

router.get("/tasks", async (req, res) => {
  const { category, shared, page = 1, limit = 10, sortBy, order } = req.query;
  const match = {};
  if (category) match.category = category;
  if (shared !== undefined) match.shared = shared === "true";

  const tasks = await Task.find(match)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ [sortBy]: order })
    .populate("category");

  res.status(200).send(tasks);
});

router.get("/tasks/:id", async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).send();
  res.status(200).send(task);
});

router.put("/tasks/:id", async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).send();
  res.status(200).send(task);
});

router.delete("/tasks/:id", async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!task) return res.status(404).send();
  res.status(204).send();
});

// CRUD for Categories
router.post("/categories", async (req, res) => {
  const category = new Category({
    ...req.body,
    user: req.user._id,
  });
  await category.save();
  res.status(201).send(category);
});

router.get("/categories", async (req, res) => {
  const categories = await Category.find({ user: req.user._id });
  res.status(200).send(categories);
});

router.get("/categories/:id", async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!category) return res.status(404).send();
  res.status(200).send(category);
});

router.put("/categories/:id", async (req, res) => {
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!category) return res.status(404).send();
  res.status(200).send(category);
});

router.delete("/categories/:id", async (req, res) => {
  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!category) return res.status(404).send();
  res.status(204).send();
});

module.exports = router;
