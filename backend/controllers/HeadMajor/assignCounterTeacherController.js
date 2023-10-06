const Student = require("../../models/Student");
const SuggestTopic = require("../../models/SuggestTopic");
const TopicStudent = require("../../models/TopicStudent");

const jwt = require("jsonwebtoken");

const assignCounterTeacherController = {
  // GET
  getAllStudentsNeedAssign: async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);

    const { searchQuery, year, semester } = req.query;
    const { nameMajor } = decoded.userInfo;
    const query = { nameMajor };
    try {
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

      const data = await TopicStudent.aggregate([
        {
          $match: {
            statePresentProject: "Đã được phê duyệt",
            nameCounterTeacher: { $exists: false },
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
            nameTeacher: 1,
            nameCounterTeacher: 1,
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
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách sinh viên đăng ký bảo vệ." });
    }
  },

  assignCounterTeacher: async (req, res) => {
    try {
      const { id } = req.params;
      const { valNameTeacher: nameCounterTeacher } = req.body;
      await TopicStudent.findByIdAndUpdate(id, { nameCounterTeacher });
      res.status(200).json({ message: "Phê duyệt thành công" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi khi phân công giáo viên" });
    }
  },
};

module.exports = assignCounterTeacherController;
