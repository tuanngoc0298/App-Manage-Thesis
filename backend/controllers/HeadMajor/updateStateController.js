const Student = require("../../models/Student");
const SuggestTopic = require("../../models/SuggestTopic");
const TopicStudent = require("../../models/TopicStudent");

const jwt = require("jsonwebtoken");

const updateStateController = {
  // GET
  getAllStudents: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);

      const { searchQuery, year, semester, isTabComplete } = req.query;
      const { nameMajor } = decoded.userInfo;
      const query = { nameMajor };
      if (isTabComplete) {
        query.state = { $ne: "Đăng ký đề tài" };
      } else {
        query.state = "Đăng ký đề tài";
      }
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
            _id: "$topic._id", // Loại bỏ trường _id nếu bạn không muốn giữ nó
            codeStudent: 1,
            nameStudent: "$topic.name",
            state: "$topic.state",
            score: "$scoreResult.average",
            yearTopic: 1,
            semesterTopic: 1,
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

  updateState: async (req, res) => {
    const { id } = req.params;
    const { isApprove } = req.body;
    try {
      if (isApprove === "Duyệt") {
        await Student.findByIdAndUpdate(id, { state: "Hoàn thành KLTN" });
        res.status(200).send("Phê duyệt thành công.");
      }
      if (isApprove === "Từ chối") {
        await Student.findByIdAndUpdate(id, { state: "Không hoàn thành KLTN" });
        res.status(200).send("Từ chối phê duyệt thành công.");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Đã xảy ra lỗi.");
    }
  },
};

module.exports = updateStateController;
