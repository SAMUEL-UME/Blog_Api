const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state: {
      type: String,
      default: "published",
      enum: ["draft", "published"],
    },
    reading_time: Number,
    read_count: {
      type: Number,
      default: 0,
    },
    tags: [String],
    body: String,
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
