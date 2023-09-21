const mongoose = require("mongoose");
const CapstoneProjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  nameMajor: {
    type: String,
    required: true,
  },
  credit: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CapstoneProject", CapstoneProjectSchema);
