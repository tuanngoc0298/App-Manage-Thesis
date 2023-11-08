const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Người phụ trách", "Sinh viên", "Giáo viên", "Phòng đào tạo"],
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("User", userSchema);
