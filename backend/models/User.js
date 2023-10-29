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
    enum: ["admin", "NguoiPhuTrach", "SinhVien", "GiaoVien", "PhongDaoTao"],
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("User", userSchema);
