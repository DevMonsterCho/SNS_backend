const mongoose = require("mongoose");

const { Schema } = mongoose;

const File = new Schema({
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
});

module.exports = mongoose.model("File", File);
