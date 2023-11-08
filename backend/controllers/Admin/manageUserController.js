const User = require("../../models/User");

const XLSX = require("xlsx");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");
const bcrypt = require("bcrypt");

const manageUserController = {
  // GET
  getAllUsers: async (req, res) => {
    try {
      const { searchQuery } = req.query;
      const query = {};

      if (searchQuery) {
        query.$or = [
          { email: { $regex: searchQuery, $options: "i" } },
          { code: { $regex: searchQuery, $options: "i" } },
          { username: { $regex: searchQuery, $options: "i" } },
        ];
      }
      const data = await User.find(query).sort({ role: 1 });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách người dùng." });
    }
  },
  // IMPORT
  importUsers: async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    try {
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      let datas = XLSX.utils.sheet_to_json(worksheet);
      // Lọc dữ liệu có đủ 4 trường thông tin

      for (const data of datas) {
        const { code, username, email, role } = data;

        if (!code || !username || !email || !role) {
          return res.status(500).send("Thiếu dữ liệu!.");
        }
        const existingUser = await User.findOne({ $or: [{ username }, { code }] });
        if (existingUser) {
          return res.status(500).send("Trùng lặp mã người dùng hoặc tên đăng nhập!.");
        }
      }

      for (const data of datas) {
        const { code, username, email, role } = data;

        const resetTokens = new Map();
        const newPassword = crypto.randomBytes(3).toString("hex");
        resetTokens.set(email, newPassword);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const user = new User({ username, password: hashedPassword, code, role, email });
        await user.save();

        // Gửi email mật khẩu
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "quanlykhoaluan0298@gmail.com",
            pass: "cnnoxgpfqkjiwrjr",
          },
        });
        const mailOptions = {
          from: '"Quản lý khóa luận" <quanlykhoaluan0298@gmail.com>',
          to: email,
          subject: "Cấp tài khoản",
          html: `Tài khoản hệ thống cấp cho bạn có Tên đăng nhập là: <span style="font-weight: bold">${username} </span> và Mật khẩu là: <span style="font-weight: bold">${newPassword} </span>. Vui lòng đăng nhập lại vào hệ thống bằng tài khoản trên!`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.status(500).send("Có lỗi xảy ra khi gửi email.");
          } else {
          }
        });
      }
      res.status(200).send("Import thành công!.");
    } catch (err) {
      console.log(err);
      res.status(500).send("Import thất bại!.");
    }
  },
  // Add
  addUser: async (req, res) => {
    const { username, code, email, role } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { code }] });
    if (existingUser) {
      return res.status(500).send("Mã người dùng hoặc tên đăng nhập đã tồn tại");
    }
    try {
      const resetTokens = new Map();
      const newPassword = crypto.randomBytes(3).toString("hex");
      resetTokens.set(email, newPassword);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const user = new User({ username, password: hashedPassword, code, role, email });
      await user.save();

      // Gửi email mật khẩu
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "quanlykhoaluan0298@gmail.com",
          pass: "cnnoxgpfqkjiwrjr",
        },
      });
      const mailOptions = {
        from: '"Quản lý khóa luận" <quanlykhoaluan0298@gmail.com>',
        to: email,
        subject: "Cấp tài khoản",
        html: `Tài khoản hệ thống cấp cho bạn có Tên đăng nhập là: <span style="font-weight: bold">${username} </span> và Mật khẩu là: <span style="font-weight: bold">${newPassword} </span>. Vui lòng đăng nhập lại vào hệ thống bằng tài khoản trên!`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).send("Có lỗi xảy ra khi gửi email.");
        } else {
        }
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Lỗi khi thêm người dùng mới.");
    }
  },
  editUser: async (req, res) => {
    const { username, code, email, role } = req.body;
    const { id } = req.params;
    const existingUser = await User.findOne({ _id: { $ne: id }, $or: [{ username }, { code }] });
    if (existingUser) {
      return res.status(500).send("Mã người dùng hoặc tên đăng nhập đã tồn tại");
    }
    try {
      const resetTokens = new Map();
      const newPassword = crypto.randomBytes(3).toString("hex");
      resetTokens.set(email, newPassword);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const user = await User.findByIdAndUpdate(
        id,
        { username, password: hashedPassword, code, email, role },
        { new: true }
      );

      // Gửi email mật khẩu
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "quanlykhoaluan0298@gmail.com",
          pass: "cnnoxgpfqkjiwrjr",
        },
      });
      const mailOptions = {
        from: '"Quản lý khóa luận" <quanlykhoaluan0298@gmail.com>',
        to: email,
        subject: "Cấp tài khoản",
        html: `Tài khoản hệ thống cấp cho bạn có Tên đăng nhập là: <span style="font-weight: bold">${username} </span> và Mật khẩu là: <span style="font-weight: bold">${newPassword} </span>. Vui lòng đăng nhập lại vào hệ thống bằng tài khoản trên!`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).send("Có lỗi xảy ra khi gửi email.");
        } else {
        }
      });

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send("Lỗi khi sửa người dùng.");
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      await User.findByIdAndRemove(id);
      res.json({ message: "Xóa người dùng thành công!" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xóa người dùng ." });
    }
  },
};

module.exports = manageUserController;
