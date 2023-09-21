const Topic = require("../../models/Topic");
const jwt = require("jsonwebtoken");

const ChooseTopicController = {
  getTopicsByMajor: async (req, res) => {
    const { searchQuery } = req.query;
    try {
      if (searchQuery) {
        const topics = await Topic.find({
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { describe: { $regex: searchQuery, $options: "i" } },
            { nameTeacher: { $regex: searchQuery, $options: "i" } },
          ],
        });

        res.json(topics);
      } else {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
        const { major } = decoded.userInfo;
        const topics = await Topic.find({ nameMajor: major });
        res.json(topics);
      }
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách đề tài." });
    }
  },
  // GET
  getChooseTopic: async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { nameTopic } = decoded.userInfo;

    try {
      const topics = await Topic.find({
        name: nameTopic,
      });
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải đề tài đăng ký." });
    }
  },

  // Add
  addTopic: async (req, res) => {
    const { describe, name, nameMajor, nameTeacher } = req.body;
    const existingTopic = await Topic.findOne({ $or: [{ name }] });

    if (existingTopic) {
      return res.status(400).json({ message: "Đề tài đã tồn tại" });
    }
    try {
      const student = new Topic({ describe, name, nameMajor, nameTeacher });
      await student.save();
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi thêm đề tài mới." });
    }
  },
};

module.exports = ChooseTopicController;
