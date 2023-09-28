const Topic = require("../../models/Topic");
const TopicStudent = require("../../models/TopicStudent");
const SuggestTopic = require("../../models/SuggestTopic");
const jwt = require("jsonwebtoken");

const ChooseTopicController = {
  getTopicsByMajor: async (req, res) => {
    const { searchQuery } = req.query;
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { nameMajor } = decoded.userInfo;
    try {
      if (searchQuery) {
        const topics = await Topic.find({
          $or: [
            { nameTopic: { $regex: searchQuery, $options: "i" } },
            { describeTopic: { $regex: searchQuery, $options: "i" } },
            { nameTeacher: { $regex: searchQuery, $options: "i" } },
          ],
          nameMajor,
        });

        res.json(topics);
      } else {
        const topics = await Topic.find({ nameMajor });

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
      const { code } = decoded.userInfo;
      const topicStudent = await TopicStudent.findOne({ codeStudent: code });
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
        code,
      } = req.body;

      if (!(await SuggestTopic.exists({ codeStudent: code }))) {
        const topicStudent = new TopicStudent({ codeStudent: code, nameTopic });
        await topicStudent.save();
        res.status(200).json({ message: "Đăng ký thành công" });
      } else {
        res.status(500).json({ message: "Bạn phải hủy đăng ký đề tài đề xuất trước" });
      }
    } catch (error) {
      res.status(500).json({ message: "Bạn chỉ được đăng ký 1 đề tài." });
    }
  },
  // Hủy đăng ký đề tài
  cancleRegisterTopic: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { code } = decoded.userInfo;

      await TopicStudent.findOneAndDelete({ codeStudent: code });
      res.status(200).json({ message: "Hủy đăng ký thành công" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi hủy đăng ký đề tài." });
    }
  },
};

module.exports = ChooseTopicController;
