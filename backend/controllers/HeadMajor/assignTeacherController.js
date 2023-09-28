const Student = require("../../models/Student");
const SuggestTopic = require("../../models/SuggestTopic");
const jwt = require("jsonwebtoken");

const assignTeacherController = {
  // GET
  getAllStudentsNeedAssign: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);

      const { searchQuery, year, semester } = req.query;
      const { nameMajor } = decoded.userInfo;
      const query = { nameMajor };

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

      const data = await SuggestTopic.aggregate([
        {
          $match: {
            state: "Phân công",
            nameTeacher: "",
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

  assignTeacher: async (req, res) => {
    try {
      const { id } = req.params;
      const { valNameTeacher: nameTeacher } = req.body;
      await SuggestTopic.findByIdAndUpdate(id, { nameTeacher });
      res.status(200).json({ message: "Phê duyệt thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi phân công giáo viên" });
    }
  },
};

module.exports = assignTeacherController;
