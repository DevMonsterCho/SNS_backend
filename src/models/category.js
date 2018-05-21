const mongoose = require("mongoose");
const categoryForm = require("format/category.form");

const { Schema } = mongoose;

const Owner = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  }
});

const Group = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const Category = new Schema({
  owner: Owner,
  key: {
    // menu path
    type: String,
    lowercase: true,
    trim: true,
    required: true
  },
  category: {
    // menu name
    type: String,
    trim: true,
    required: true
  },
  type: {
    type: String,
    enum: categoryForm.type.enum,
    required: true
  },
  static: {
    type: Schema.Types.ObjectId
  },
  read: Group,
  write: Group,
  sequence: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  private: {
    type: Boolean,
    default: false
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  modifyDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Category", Category);
