const jwt = require("jsonwebtoken");
const TopicStudent = require("../../models/TopicStudent");
const SuggestTopic = require("../../models/SuggestTopic");

const suggestTopicController = {
  getSuggestTopic: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { code } = decoded.userInfo;
      const suggestTopic = await SuggestTopic.findOne({ codeStudent: code });
      res.status(200).json(suggestTopic);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách đề tài." });
    }
  },

  // Add
  addSuggestTopic: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { nameMajor } = decoded.userInfo;

      let { nameTopic, describe, nameTeacher, state, code } = req.body;
      if (!nameTeacher) {
        state = "Phân công";
      }
      if (await TopicStudent.exists({ codeStudent: code })) {
        return res.status(500).json({ message: "Bạn phải hủy để tài đăng ký trước ." });
      }
      const suggestTopic = new SuggestTopic({
        codeStudent: code,
        nameTopic,
        describe,
        nameTeacher,
        nameMajor,
        state,
      });
      await suggestTopic.save();

      res.status(200).json(suggestTopic);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Bạn chỉ được đề xuất 1 đề tài ." });
    }
  },
  editSuggestTopic: async (req, res) => {
    try {
      const { id } = req.params;
      const suggestTopic = await SuggestTopic.findById(id);
      if (suggestTopic.state === "Đang chờ duyệt") {
        let { nameTopic, describe, nameTeacher, state, codeStudent } = req.body;
        if (!nameTeacher) {
          state = "Phân công";
        } else {
          state = "Đang chờ duyệt";
        }
        const topic = await SuggestTopic.findOneAndUpdate(
          { codeStudent },
          { nameTopic, describe, nameTeacher, state },
          { new: true }
        );
        res.status(200).json(topic);
      } else {
        res.status(500).json({ message: "Không thể sửa đề tài !" });
      }
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi sửa đề tài đề xuất." });
    }
  },
  deleteSuggestTopic: async (req, res) => {
    try {
      const { id } = req.params;
      const suggestTopic = await SuggestTopic.findById(id);
      if (suggestTopic.state === "Đang chờ duyệt") {
        await SuggestTopic.deleteOne({ _id: id });
        res.status(200).json({ message: "Xóa đề tài đề xuất thành công!" });
      } else {
        res.status(500).json({ message: "Không thể xóa đề tài !" });
      }
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa đề tài đề xuất." });
    }
  },
};

module.exports = suggestTopicController;
