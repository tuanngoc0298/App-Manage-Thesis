const mongoose = require("mongoose");

const majorSchema = new mongoose.Schema({
  nameDepartment: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nameHead: {
    type: String,
  },
});

module.exports = mongoose.model("Major", majorSchema);
