const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const SuggestTopic = require("../../models/SuggestTopic");

const suggestTopicController = {
  getSuggestTopic: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { codeUser } = decoded;
      const suggestTopic = await SuggestTopic.findOne({ codeTeacher: codeUser });

      res.status(200).json(suggestTopic);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách đề tài." });
    }
  },

  // Add
  addSuggestTopic: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { codeUser } = decoded;
      const { nameTopic, describe, nameTeacher, state } = req.body;
      const suggestTopic = new SuggestTopic({ codeStudent: codeUser, nameTopic, describe, nameTeacher, state });
      await suggestTopic.save();

      res.status(200).json({ message: "Đăng ký thành công" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Bạn chỉ được đề xuất 1 đề tài ." });
    }
  },
  editSuggestTopic: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { _id } = decoded;

      const { name, describe, nameTeacher, state } = req.body;

      const topic = await User.findByIdAndUpdate(
        _id,
        { "SinhVienInfo.suggestTopic": { name, describe, nameTeacher, state } },
        { new: true }
      );
      res.status(200).json(topic.SinhVienInfo.suggestTopic);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi sửa đề tài đề xuất." });
    }
  },
  deleteSuggestTopic: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { _id } = decoded;

      const topic = await User.findByIdAndUpdate(_id, { "SinhVienInfo.suggestTopic": null }, { new: true });
      res.json({ message: "Xóa đề tài đề xuất thành công!" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xóa đề tài đề xuất." });
    }
  },
};

module.exports = suggestTopicController;
