const mongoose = require("mongoose");
const staticForm = require("format/static.form");

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
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const File = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  }
});

const Static = new Schema({
  owner: Owner,
  category: Category,
  type: {
    type: String,
    enum: staticForm.type.enum,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subTitle: {
    type: String,
    default: ""
  },
  content: {
    type: String,
    required: true
  },
  footer: {
    type: String,
    default: ""
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

module.exports = mongoose.model("Static", Static);
