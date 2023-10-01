const Student = require("../../models/Student");
const TopicStudent = require("../../models/TopicStudent");
const jwt = require("jsonwebtoken");

const instructedStudentController = {
  // GET
  getAllTopicStudents: async (req, res) => {
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
          { nameMajor: { $regex: searchQuery, $options: "i" } },
        ];
      }

      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { name } = decoded.userInfo;
      const data = await TopicStudent.aggregate([
        {
          $match: {
            nameTeacher: name,
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
            _id: 1,
            codeStudent: 1,
            nameTopic: 1,
            yearTopic: 1,
            semesterTopic: 1,
            nameStudent: "$topic.name",
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
      res.status(500).json({ error: "Lỗi khi tải danh sách Sinh viên hướng dẫn." });
    }
  },
};

module.exports = instructedStudentController;
