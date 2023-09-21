const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["admin", "NguoiPhuTrach", "SinhVien", "GiaoVienHuongDan", "GiaoVienPhanBien", "HoiDongBaoVe", "PhongDaoTao"],
    require: true,
  },
  adminInfo: {
    name: String,
  },
  NguoiPhuTrachInfo: {
    name: String,
    major: String,
  },
  SinhVienInfo: {
    name: String,
    major: String,
    nameTopic: String,
  },
  GiaoVienHuongDanInfo: {
    name: String,
    major: String,
  },
  GiaoVienPhanBienInfo: {
    name: String,
    major: String,
  },
  HoiDongBaoVeInfo: {
    name: String,
    major: String,
  },
  PhongDaoTaoInfo: {
    name: String,
  },
});

module.exports = mongoose.model("User", userSchema);
