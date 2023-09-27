const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const HeadDepartment = require("../models/HeadDepartment");

const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

const authController = {
  // REGISTER
  registerUser: async (req, res) => {
    const { username, password, role, userCode } = req.body;
    try {
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(400).json({ message: "Người dùng đã tồn tại" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await new User({ username, password: hashedPassword, role, userCode });
      await user.save();
      res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi khi đăng ký!" });
    }
  },

  // LOGIN
  loginUser: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Tài khoản không tồn tại!" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Mật khẩu không đúng!" });
      }

      let nameUser, userInfo;

      switch (user.role) {
        case "admin":
          userInfo = await Admin.findOne({ codeAdmin: user.codeUser });
          nameUser = userInfo.nameAdmin;
          break;
        case "NguoiPhuTrach":
          userInfo = await Teacher.findOne({ codeTeacher: user.codeUser });
          nameUser = userInfo.nameTeacher;

          break;
        case "SinhVien":
          userInfo = await Student.findOne({ codeStudent: user.codeUser });
          nameUser = userInfo.nameStudent;

          break;
        case "GiaoVien":
          userInfo = await Teacher.findOne({ codeTeacher: user.codeUser });
          nameUser = userInfo.nameTeacher;

          break;
        case "PhongDaoTao":
          userInfo = await HeadDepartment.findOne({ codeHeadDepartment: user.codeUser });
          nameUser = userInfo.nameHeadDepartment;

          break;
      }
      const token = jwt.sign(
        { _id: user._id, role: user.role, nameUser: nameUser, nameMajor: userInfo.nameMajor, codeUser: user.codeUser },
        process.env.JWT_ACCESS_KEY,
        {
          expiresIn: 1800,
        }
      );
      res.cookie("token", token);
      res.json({ token, role: user.role, nameUser: nameUser });
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi khi đăng nhập!" });
    }
  },
  //
};

module.exports = authController;
