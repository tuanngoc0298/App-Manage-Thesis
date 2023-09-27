const Topic = require("../../models/Topic");
const TopicStudent = require("../../models/TopicStudent");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const ChooseTopicController = {
  getTopicsByMajor: async (req, res) => {
    const { searchQuery } = req.query;
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { nameMajor } = decoded;
    try {
      if (searchQuery) {
        const topics = await Topic.find({
          $or: [
            { nameTopic: { $regex: searchQuery, $options: "i" } },
            { describeTopic: { $regex: searchQuery, $options: "i" } },
            { nameTeacher: { $regex: searchQuery, $options: "i" } },
          ],
          nameMajor: nameMajor,
        });

        res.json(topics);
      } else {
        const topics = await Topic.find({ nameMajor: nameMajor });

        res.json(topics);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi tải danh sách đề tài." });
    }
  },
  // GET
  getChooseTopic: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { codeUser } = decoded;
      const topicStudent = await TopicStudent.findOne({ codeStudent: codeUser });
      const topicSelected = await Topic.find({ nameTopic: topicStudent ? topicStudent.nameTopic : "" });

      res.json(topicSelected);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi tải đề tài đăng ký." });
    }
  },

  // Đăng ký đề tài
  registerTopic: async (req, res) => {
    try {
      const {
        editTopic: { nameTopic },
        codeUser,
      } = req.body;
      const topicStudent = new TopicStudent({ codeStudent: codeUser, nameTopic });
      await topicStudent.save();

      res.status(200).json({ message: "Đăng ký thành công" });
    } catch (error) {
      res.status(500).json({ message: "Bạn chỉ được đăng ký 1 đề tài." });
    }
  },
  // Hủy đăng ký đề tài
  cancleRegisterTopic: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { codeUser } = decoded;

      await TopicStudent.findOneAndDelete({ codeStudent: codeUser });
      res.status(200).json({ message: "Hủy đăng ký thành công" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi hủy đăng ký đề tài." });
    }
  },
};

module.exports = ChooseTopicController;
