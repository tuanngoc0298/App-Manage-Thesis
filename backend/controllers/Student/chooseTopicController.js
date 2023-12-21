const Topic = require("../../models/Topic");
const TopicStudent = require("../../models/TopicStudent");
const SuggestTopic = require("../../models/SuggestTopic");
const Report = require("../../models/Report");
const jwt = require("jsonwebtoken");

const ChooseTopicController = {
  getTopicsByMajor: async (req, res) => {
    const { searchQuery } = req.query;
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    console.log(req.cookies);
    console.log(decoded);
    const { nameMajor, year, semester } = decoded.userInfo;
    try {
      if (searchQuery) {
        const topics = await Topic.find({
          $or: [
            { nameTopic: { $regex: searchQuery, $options: "i" } },
            { describeTopic: { $regex: searchQuery, $options: "i" } },
            { nameTeacher: { $regex: searchQuery, $options: "i" } },
          ],
          nameMajor,
          year,
          semester,
        });

        res.json(topics);
      } else {
        const topics = await Topic.find({ nameMajor, year, semester });

        res.json(topics);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi khi tải danh sách đề tài." });
    }
  },
  // GET
  getChooseTopic: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { code } = decoded.userInfo;

      const topicStudent = await TopicStudent.findOne({ codeStudent: code });
      const topicSelected = await Topic.find({
        nameTopic: topicStudent ? topicStudent.nameTopic : "",
      });

      res.json(topicSelected);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi khi tải đề tài đăng ký." });
    }
  },

  // Đăng ký đề tài
  registerTopic: async (req, res) => {
    try {
      const {
        editTopic: { nameTopic, nameTeacher },
        code,
      } = req.body;
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { year, semester } = decoded.userInfo;

      if (!(await SuggestTopic.exists({ codeStudent: code }))) {
        const topicStudent = new TopicStudent({
          codeStudent: code,
          nameTopic,
          nameTeacher,
          yearTopic: year,
          semesterTopic: semester,
        });
        await topicStudent.save();
        res.status(200).json({ message: "Đăng ký thành công" });
      } else {
        res
          .status(500)
          .json({ message: "Bạn phải hủy đăng ký đề tài đề xuất trước" });
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
      if (await Report.exists({ codeStudent: code })) {
        return res.status(500).json({ message: "Bạn không thể xóa." });
      }
      await TopicStudent.findOneAndDelete({ codeStudent: code });
      res.status(200).json({ message: "Hủy đăng ký thành công" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi khi hủy đăng ký đề tài." });
    }
  },
};

module.exports = ChooseTopicController;
