const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  describe: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Department", departmentSchema);
