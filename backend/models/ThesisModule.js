const mongoose = require("mongoose");
const ThesisModuleSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
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

module.exports = mongoose.model("ThesisModule", ThesisModuleSchema);
