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
        return res.status(500).json({ message: "Người dùng đã tồn tại" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await new User({
        username,
        password: hashedPassword,
        role,
        code: userCode,
      });
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
        return res.status(401).send("Tên đăng nhập hoặc mật khẩu không đúng!");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send("Mật khẩu không đúng!");
      }

      let userInfo;

      switch (user.role) {
        case "Admin":
          userInfo = await Admin.findOne({ code: user.code });
          break;
        case "Người phụ trách":
          userInfo = await Teacher.findOne({ code: user.code });
          break;
        case "Sinh viên":
          userInfo = await Student.findOne({ code: user.code });
          break;
        case "Giáo viên":
          userInfo = await Teacher.findOne({ code: user.code });
          break;
        case "Phòng đào tạo":
          userInfo = await HeadDepartment.findOne({ code: user.code });
          break;
      }
      if (!userInfo) {
        return res
          .status(500)
          .send("Bạn chưa có thông tin trong cơ sở dữ liệu!");
      }
      const token = jwt.sign(
        { _id: user._id, role: user.role, userInfo },
        process.env.JWT_ACCESS_KEY,
        {
          expiresIn: 60 * 60 * 6,
        }
      );
      res.cookie("token", token, { sameSite: "none", secure: true });

      res.json({ token, role: user.role, userInfo });
    } catch (error) {
      res.status(500).send("Đã xảy ra lỗi khi đăng nhập!");
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

    if (!user)
      return res
        .status(500)
        .send("Mã sinh viên và email không khớp nhau hoặc dữ liệu sai!");

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
      html: `Hệ thống nhận được yêu cầu đổi mật khẩu cho tài khoản <span style="font-weight: bold">${username} </span> của bạn. Nếu đúng do bạn thực hiện thì mật khẩu mới của bạn là: <span style="font-weight: bold">${newPassword} </span> và thực hiện bằng cách nhấn vào liên kết sau để hệ thống tiến hành đổi <a href="https://thesis-management-server.onrender.com/api/resetPassword?username=${username}&newPassword=${newPassword}">Bấm vào đây để hệ thống tiến hành đổi mật khẩu</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Có lỗi xảy ra khi gửi email.");
      } else {
        res
          .status(200)
          .send(
            "Email đã được gửi thành công. Vui lòng kiểm tra email của bạn."
          );
      }
    });
  },
  resetPassWord: async (req, res) => {
    try {
      const { username, newPassword } = req.query;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.findOneAndUpdate({ username }, { password: hashedPassword });
      res
        .status(200)
        .sendFile(path.join(__dirname, "../view", "resetPassword.html"));
    } catch (err) {
      console.log(err);
      res.status(500).send("Đổi mật khẩu không thành công!.");
    }
  },
  //
  getEmail: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { _id } = decoded;
      const user = await User.findById(_id);

      res.status(200).send(user.email);
    } catch (err) {
      console.log(err);
      res.status(500).send("Get email thất bại");
    }
  },
  updateEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { _id } = decoded;

      await User.findByIdAndUpdate(_id, { $set: { email } });
      res.status(200).send("Cập nhật thành công");
    } catch (err) {
      res.status(200).send("Cập nhật thất bại");
    }
  },
};

module.exports = authController;
