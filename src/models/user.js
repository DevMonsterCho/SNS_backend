const mongoose = require("mongoose");

const { Schema } = mongoose;

const Friends = new Schema({
  _id: {
    type: String,
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

const User = new Schema({
  name: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  grade: {
    type: Number,
    default: 1
  },
  friends: [Friends],
  message: {
    type: String
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

module.exports = mongoose.model("User", User);
