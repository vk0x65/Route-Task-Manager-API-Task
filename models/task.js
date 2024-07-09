const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  type: { type: String, enum: ["Text", "List"] },
  listItems: [String],
  shared: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

module.exports = Task;
