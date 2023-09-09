const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^[A-Z]{3}\d{2}$/.test(value),
      message: (props) => `${props.value} không phù hợp với định dạng mã khoa (3 chữ in hoa + 2 số).`,
    },
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
});

module.exports = mongoose.model("Department", departmentSchema);
