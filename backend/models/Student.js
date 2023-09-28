const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  code: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  nameMajor: {
    type: String,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  semester: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Student", studentSchema);
