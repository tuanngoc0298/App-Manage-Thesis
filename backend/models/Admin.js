const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  codeAdmin: {
    type: String,
    require: true,
  },
  nameAdmin: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
