const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  codeTeacher: {
    type: String,
    required: true,
    unique: true,
  },
  nameTeacher: {
    type: String,
    required: true,
  },
  nameMajor: {
    type: String,
    required: true,
  },
  roleTeacher: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
