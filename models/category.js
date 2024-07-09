const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

module.exports = Category;
