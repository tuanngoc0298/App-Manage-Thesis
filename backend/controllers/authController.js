const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authController = {
  // REGISTER
  registerUser: async (req, res) => {
    const { username, password, role } = req.body;
    try {
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(400).json({ message: "Người dùng đã tồn tại" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await new User({ username, password: hashedPassword, role });
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

      const token = jwt.sign({ _id: user._id, username: user.username, role: user.role }, process.env.JWT_ACCESS_KEY, {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi khi đăng nhập!" });
    }
  },
  //
};

module.exports = authController;
