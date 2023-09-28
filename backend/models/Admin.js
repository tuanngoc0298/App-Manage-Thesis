const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  code: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
