const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: String,
  code: String,
  head: String,
  students: String,
});

module.exports = mongoose.model("Department", departmentSchema);
