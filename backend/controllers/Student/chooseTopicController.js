const Topic = require("../../models/Topic");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const ChooseTopicController = {
  getTopicsByMajor: async (req, res) => {
    const { searchQuery } = req.query;
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { major } = decoded.userInfo;

    try {
      if (searchQuery) {
        const topics = await Topic.find({
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { describe: { $regex: searchQuery, $options: "i" } },
            { nameTeacher: { $regex: searchQuery, $options: "i" } },
          ],
          nameMajor: major,
        });

        res.json(topics);
      } else {
        const topics = await Topic.find({ nameMajor: major });
        res.json(topics);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi tải danh sách đề tài." });
    }
  },
  // GET
  getChooseTopic: async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { _id } = decoded;

    try {
      const user = await User.findById(_id);
      const { nameTopic } = user.SinhVienInfo;
      const topic = await Topic.find({ name: nameTopic });
      res.json(topic);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải đề tài đăng ký." });
    }
  },

  // Đăng ký đề tài
  registerTopic: async (req, res) => {
    const { name: nameTopic } = req.body;

    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { _id: idUser } = decoded;
    try {
      const data = await User.findByIdAndUpdate(
        idUser,
        { $set: { "SinhVienInfo.nameTopic": nameTopic } },
        { new: true }
      );
      res.status(200).json({ message: "Đăng ký thành công" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi thêm đề tài mới." });
    }
  },
  // Đăng ký đề tài
  cancleRegisterTopic: async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { _id: idUser } = decoded;
    try {
      await User.findByIdAndUpdate(idUser, { $set: { "SinhVienInfo.nameTopic": null } }, { new: true });
      res.status(200).json({ message: "Đăng ký thành công" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi thêm đề tài mới." });
    }
  },
};

module.exports = ChooseTopicController;
