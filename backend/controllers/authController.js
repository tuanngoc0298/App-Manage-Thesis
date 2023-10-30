const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");

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

      const user = await new User({ username, password: hashedPassword, role, code: userCode });
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

      let userInfo;

      switch (user.role) {
        case "admin":
          userInfo = await Admin.findOne({ code: user.code });
          break;
        case "NguoiPhuTrach":
          userInfo = await Teacher.findOne({ code: user.code });
          break;
        case "SinhVien":
          userInfo = await Student.findOne({ code: user.code });
          break;
        case "GiaoVien":
          userInfo = await Teacher.findOne({ code: user.code });
          break;
        case "PhongDaoTao":
          userInfo = await HeadDepartment.findOne({ code: user.code });
          break;
      }
      const token = jwt.sign({ _id: user._id, role: user.role, userInfo }, process.env.JWT_ACCESS_KEY, {
        expiresIn: 60 * 60 * 6,
      });
      res.cookie("token", token);
      res.json({ token, role: user.role, userInfo });
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi khi đăng nhập!" });
    }
  },
  changePassword: async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { _id } = decoded;
    const { newPass, currentPass } = req.body;

    try {
      const user = await User.findById(_id);

      const passwordMatch = await bcrypt.compare(currentPass, user.password);
      if (!passwordMatch) {
        return res.status(401).send("Mật khẩu hiện tại không đúng!");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPass, salt);

      await User.findByIdAndUpdate(_id, { password: hashedPassword });
      res.status(200).send("Đổi mật khẩu thành công!");
    } catch (err) {
      res.status(500).send("Đổi mật khẩu thất bại!");
    }
  },
  forgetPassWord: async (req, res) => {
    const { email, username } = req.body;
    const user = await User.exists({ username, email });

    if (!user) return res.status(500).send("Mã sinh viên và email không khớp nhau hoặc dữ liệu sai!");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "quanlykhoaluan0298@gmail.com",
        pass: "cnnoxgpfqkjiwrjr",
      },
    });

    const resetTokens = new Map();
    const newPassword = crypto.randomBytes(3).toString("hex");
    resetTokens.set(email, newPassword);

    const mailOptions = {
      from: '"Quản lý khóa luận" <quanlykhoaluan0298@gmail.com>',
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu",
      html: `Hệ thống nhận được yêu cầu đổi mật khẩu cho tài khoản ${username} của bạn. Nếu đúng do bạn thực hiện thì mật khẩu mới của bạn là: ${newPassword} và thực hiện bằng cách nhấn vào liên kết sau để hệ thống tiến hành đổi <a href="${process.env.HOST}:${process.env.PORT}/api/resetPassword?username=${username}&newPassword=${newPassword}">Bấm vào đây để hệ thống tiến hành đổi mật khẩu</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Có lỗi xảy ra khi gửi email.");
      } else {
        res.status(200).send("Email đã được gửi thành công. Vui lòng kiểm tra email của bạn.");
      }
    });
  },
  resetPassWord: async (req, res) => {
    try {
      const { username, newPassword } = req.query;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.findOneAndUpdate({ username }, { password: hashedPassword });
      res.status(200).sendFile(path.join(__dirname, "../view", "resetPassword.html"));
    } catch (err) {
      console.log(err);
      res.status(500).send("Đổi mật khẩu không thành công!.");
    }
  },
  //
};

module.exports = authController;
