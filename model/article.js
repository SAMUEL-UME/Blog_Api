const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a title"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state: {
      type: String,
      default: "draft",
      enum: ["draft", "published"],
    },
    reading_time: Number,
    read_count: {
      type: Number,
      default: 0,
    },
    tags: [String],
    body: {
      type: String,
      required: [true, "Blog body cannot be empty"],
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
