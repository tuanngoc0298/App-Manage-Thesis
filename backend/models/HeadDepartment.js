const mongoose = require("mongoose");

const headDepartmentSchema = new mongoose.Schema({
  codeHeadDepartment: {
    type: String,
    require: true,
  },
  nameHeadDepartment: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("HeadDepartment", headDepartmentSchema);
