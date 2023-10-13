const TopicStudent = require("../../models/TopicStudent");
const Student = require("../../models/Student");

const moment = require("moment");

const jwt = require("jsonwebtoken");

const feedBackController = {
  // GET
  getAllStudents: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);

      const { searchQuery, year, semester, isTabFeedback } = req.query;
      const { name } = decoded.userInfo;
      const query = {};
      const condition = isTabFeedback
        ? { feedback: { $exists: true }, "protectionCouncil.members.secretary": name }
        : {
            feedback: { $exists: false },
            protectionCouncil: { $exists: true },
            "protectionCouncil.members.secretary": name,
          };
      if (year) {
        query.yearTopic = year;
      }
      if (semester) {
        query.semesterTopic = semester;
      }
      if (searchQuery) {
        query.$or = [
          { codeStudent: { $regex: searchQuery, $options: "i" } },
          { nameStudent: { $regex: searchQuery, $options: "i" } },
        ];
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
          $project: {
            __id: 1,
            codeStudent: 1,
            nameStudent: "$student.name",
            protectionCouncil: 1,
            yearTopic: 1,
            semesterTopic: 1,
            feedback: 1,
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
  // Download file
  downLoadFile: async (req, res) => {
    const { id } = req.params;

    try {
      const feedback = await TopicStudent.findById(id);
      if (!feedback) {
        res.status(404).send("Không tìm thấy nhận xét của sinh viên.");
        return;
      }
      const { nameFile, data } = feedback.feedback.fileFeedback;
      // Thiết lập đối tượng tệp để tải xuống
      res.setHeader("Content-Disposition", `attachment; filename=${nameFile}`);
      res.setHeader("Content-Type", "application/octet-stream");
      res.send(data);
    } catch (error) {
      res.status(500).send("Đã xảy ra lỗi.");
    }
  },
  // EDIT
  editFeedback: async (req, res) => {
    try {
      const { stateFeedback, nameFile } = req.body;
      const reportFile = req.file.buffer;
      const file = {
        nameFile,
        data: reportFile,
      };

      const { id } = req.params;

      const feedback = await TopicStudent.findByIdAndUpdate(
        id,
        {
          "feedback.fileFeedback": file,
          "feedback.stateFeedback": stateFeedback,
          "feedback.timeFeedback": moment().format("dddd, D MMMM YYYY, h:mm A"),
          "protectionCouncil.stateProtection": "Đã bảo vệ",
        },
        { new: true }
      );
      res.status(200).json(feedback);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi sửa Nhận xét." });
    }
  },
};

module.exports = feedBackController;
