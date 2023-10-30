const TopicStudent = require("../../models/TopicStudent");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const Major = require("../../models/Major");
const Department = require("../../models/Department");
const Topic = require("../../models/Topic");

const jwt = require("jsonwebtoken");

const establishCouncilController = {
  // GET
  getAllStudents: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);

      const { searchQuery, year, semester, isTabCouncil } = req.query;
      const { nameMajor } = decoded.userInfo;
      const query = { nameMajor };
      const condition = isTabCouncil
        ? { protectionCouncil: { $exists: true } }
        : { statePresentProject: "Được bảo vệ khóa luận", protectionCouncil: { $exists: false } };
      if (year) {
        query.year = year;
      }
      if (semester) {
        query.semester = semester;
      }
      if (searchQuery) {
        if (!isTabCouncil) {
          query.$or = [
            { codeStudent: { $regex: searchQuery, $options: "i" } },
            { nameStudent: { $regex: searchQuery, $options: "i" } },
          ];
        } else {
          query.$or = [
            { nameCouncil: { $regex: searchQuery, $options: "i" } },
            { nameStudent: { $regex: searchQuery, $options: "i" } },
            { nameTopic: { $regex: searchQuery, $options: "i" } },
          ];
        }
      }

      const data = await TopicStudent.aggregate([
        {
          $match: condition,
        },
        {
          $lookup: {
            from: Student.collection.name,
            localField: "codeStudent",
            foreignField: "code",
            as: "student",
          },
        },
        {
          $unwind: "$student", // Giải phóng các tài liệu từ mảng kết quả
        },
        {
          $lookup: {
            from: Topic.collection.name,
            localField: "nameTopic",
            foreignField: "nameTopic",
            as: "topic",
          },
        },
        {
          $unwind: "$topic", // Giải phóng các tài liệu từ mảng kết quả
        },
        {
          $project: {
            __id: 1,
            codeStudent: 1,
            protectionCouncil: 1,

            nameTopic: 1,
            nameTeacher: 1,
            nameCounterTeacher: 1,
            yearTopic: 1,
            semesterTopic: 1,
            describeTopic: "$topic.describeTopic",
            nameStudent: "$student.name",
            nameMajor: "$student.nameMajor",
          },
        },
        {
          $match: query,
        },
      ]);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi tải danh sách Sinh viên được bảo vệ khóa luận." });
    }
  },

  // EDIT
  editCouncil: async (req, res) => {
    try {
      const { protectionCouncil } = req.body;
      const { stateProtection } = protectionCouncil;

      const { chairperson, secretary, commissioner } = protectionCouncil.members;
      const values = new Set([chairperson, secretary, commissioner]);
      if (stateProtection === "Đã bảo vệ") return res.status(400).json({ error: "Không thể sửa hội đồng đã bảo vệ!" });

      if (values.size <= 2) {
        return res.status(400).json({ error: "Thành viên hội đồng không được trùng nhau!" });
      }

      const { id } = req.params;

      const existingDepartment = await TopicStudent.findOne({
        _id: { $ne: id },
        $or: [{ "protectionCouncil.nameCouncil": protectionCouncil.nameCouncil }],
      });

      if (existingDepartment) {
        return res.status(400).json({ error: "Khoa đã tồn tại" });
      }

      const council = await TopicStudent.findByIdAndUpdate(id, { protectionCouncil }, { new: true });
      res.status(200).json(council);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi sửa HĐBV." });
    }
  },
};

module.exports = establishCouncilController;
