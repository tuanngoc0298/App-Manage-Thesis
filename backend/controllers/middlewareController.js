const jwt = require("jsonwebtoken");
const User = require("../models/User");
const middlewareController = {
  // VerifyToken
  verifyToken: (req, res, next) => {
    try {
      const token = req.cookies.token;
      const idUser = jwt.verify(token, process.env.JWT_ACCESS_KEY)._id;

      User.findOne({
        _id: idUser,
      })
        .then((data) => {
          if (data) {
            next();
          } else {
            res.status(500).json("Không tìm thấy tài khoản");
          }
        })
        .catch((err) => {});
    } catch (err) {
      res.status(501).json("Bạn cần phải đăng nhập");
    }
  },
};

module.exports = middlewareController;
