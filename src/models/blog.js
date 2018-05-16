const mongoose = require("mongoose");

const { Schema } = mongoose;

const Blog = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  md: {
    type: String
  },
  files: [
    {
      _id: {
        type: String,
        required: true
      },
      uploader: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: true
      },
      path: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      lastModifiedDate: {
        type: Date,
        required: true
      }
    }
  ],
  createDate: {
    type: Date,
    default: Date.now
  },
  modifyDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Blog", Blog);
