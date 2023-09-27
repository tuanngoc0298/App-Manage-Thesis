const mongoose = require("mongoose");

const majorSchema = new mongoose.Schema({
  nameDepartment: {
    type: String,
    required: true,
  },
  codeMajor: {
    type: String,
    required: true,
    unique: true,
  },
  nameMajor: {
    type: String,
    required: true,
    unique: true,
  },
  nameHeadMajor: {
    type: String,
  },
});

module.exports = mongoose.model("Major", majorSchema);
