const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  codePermission: {
    type: String,
    required: true,
    unique: true,
  },
  namePermission: {
    type: String,
    required: true,
    unique: true,
  },
  describePermission: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Permission", permissionSchema);
