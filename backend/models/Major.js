const mongoose = require("mongoose");

const majorSchema = new mongoose.Schema({
  nameDepartment: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^[0-9]{7}$/.test(value),
      message: (props) => `${props.value} không phù hợp với định dạng mã ngành (chỉ bao gồm số).`,
    },
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  codeHead: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^[A-Z]{3}\d{3}$/.test(value),
      message: (props) => `${props.value} không phù hợp với định dạng mã trưởng ngành (3 chữ in hoa + 3 số).`,
    },
  },
  nameHead: {
    type: String,
    required: true,
    maxlength: 30,
  },
});

module.exports = mongoose.model("Major", majorSchema);
