const Student = require("../../models/Student");
const SuggestTopic = require("../../models/SuggestTopic");
const TopicStudent = require("../../models/TopicStudent");
const jwt = require("jsonwebtoken");

const approveSuggestTopicController = {
  // GET
  getAllSuggestTopics: async (req, res) => {
    try {
      const { searchQuery, year, semester } = req.query;
      const query = {};

      if (year) {
        query.year = year;
      }
      if (semester) {
        query.semester = semester;
      }
      if (searchQuery) {
        query.$or = [
          { codeStudent: { $regex: searchQuery, $options: "i" } },
          { nameStudent: { $regex: searchQuery, $options: "i" } },
          { nameTopic: { $regex: searchQuery, $options: "i" } },
          { describe: { $regex: searchQuery, $options: "i" } },
        ];
      }

      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { name } = decoded.userInfo;
      const data = await SuggestTopic.aggregate([
        {
          $match: {
            nameTeacher: name, // Lọc tài liệu SuggestTopic với nameTeacher là "Tuấn"
            state: "Đang chờ duyệt",
          },
        },
        {
          $lookup: {
            from: Student.collection.name,
            localField: "codeStudent",
            foreignField: "code",
            as: "topic",
          },
        },
        {
          $unwind: "$topic", // Giải phóng các tài liệu từ mảng kết quả
        },
        {
          $project: {
            _id: 1, // Loại bỏ trường _id nếu bạn không muốn giữ nó
            codeStudent: 1,
            nameTopic: 1,
            describe: 1,
            nameTeacher: 1,
            nameStudent: "$topic.name",
            year: "$topic.year",
            semester: "$topic.semester",
            nameMajor: "$topic.nameMajor",
          },
        },
        {
          $match: query,
        },
      ]);

      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi tải danh sách Đề tài đề xuất." });
    }
  },

  approveSuggestTopic: async (req, res) => {
    const { id } = req.params;
    const {
      isApprove,
      editSuggestTopic: { codeStudent, nameTopic, nameTeacher, year, semester },
    } = req.body;
    try {
      if (isApprove === "Duyệt") {
        const topicStudent = new TopicStudent({
          codeStudent,
          nameTopic,
          nameTeacher,
          yearTopic: year,
          semesterTopic: semester,
        });
        await topicStudent.save();
        await SuggestTopic.findByIdAndUpdate(id, { state: "Phê duyệt" });
        res.status(200).json({ message: "Phê duyệt thành công" });
      }
      if (isApprove === "Từ chối") {
        await SuggestTopic.findByIdAndUpdate(id, { state: "Phân công", nameTeacher: "" });
        res.status(200).json({ message: "Từ chối thành công" });
      }
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi duyệt đề tài." });
    }
  },
};

module.exports = approveSuggestTopicController;
