const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  nameMajor: {
    type: String,
    required: true,
  },
  roleTeacher: {
    type: String,
    enum: ["Giáo viên", "Trưởng ngành", "Trưởng khoa"],
    required: true,
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
