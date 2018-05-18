const mongoose = require("mongoose");
const boardForm = require("./board.form");

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
  nickname: {
    type: String,
    trim: true,
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
  },
  title: {
    type: String,
    required: true
  }
});

const Category = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const File = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  owner: Owner,
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
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

const Board = new Schema({
  owner: Owner,
  category: Category,
  title: {
    type: String,
    required: true
  },
  subTitle: {
    type: String
  },
  type: {
    type: String,
    enum: boardForm.type.enum,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  files: [File],
  tags: [String],
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

module.exports = mongoose.model("Board", Board);
