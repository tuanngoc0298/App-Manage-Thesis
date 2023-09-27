const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  codeDepartment: {
    type: String,
    required: true,
    unique: true,
  },
  nameDepartment: {
    type: String,
    required: true,
  },
  describeDepartment: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Department", departmentSchema);
