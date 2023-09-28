const mongoose = require("mongoose");

const headDepartmentSchema = new mongoose.Schema({
  code: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("HeadDepartment", headDepartmentSchema);
