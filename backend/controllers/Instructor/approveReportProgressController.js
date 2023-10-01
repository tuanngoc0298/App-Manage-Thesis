const TopicStudent = require("../../models/TopicStudent");
const Student = require("../../models/Student");

const jwt = require("jsonwebtoken");

const approveReportProgressController = {
  // GET
  getAllReports: async (req, res) => {
    try {
      const { searchQuery, year, semester } = req.query;
      const query = {};

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
          { nameTopic: { $regex: searchQuery, $options: "i" } },
        ];
      }
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { name } = decoded.userInfo;
      const data = await TopicStudent.aggregate([
        {
          $match: {
            nameTeacher: name,
            stateReportProgress: "Đang chờ duyệt",
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
          $unwind: "$topic",
        },
        {
          $project: {
            _id: 1,
            codeStudent: 1,
            nameStudent: "$topic.name",
            nameTopic: 1,
            yearTopic: 1,
            semesterTopic: 1,
            file: 1,
            completeLevel: 1,
          },
        },
        {
          $match: query,
        },
      ]);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải báo cáo tiến độ" });
    }
  },

  // IMPORT
  downLoadFile: async (req, res) => {
    const { id } = req.params;

    try {
      const report = await TopicStudent.findById(id);
      if (!report) {
        res.status(404).send("Không tìm thấy báo cáo cho mã sinh viên này.");
        return;
      }
      const { nameFile, data } = report.file;
      // Thiết lập đối tượng tệp để tải xuống
      res.setHeader("Content-Disposition", `attachment; filename=${nameFile}`);
      res.setHeader("Content-Type", "application/zip");
      res.send(data);
    } catch (error) {
      res.status(500).send("Đã xảy ra lỗi.");
    }
  },
  approveReportProgress: async (req, res) => {
    const { id } = req.params;
    const { isApprove, comment } = req.body;

    try {
      if (isApprove === "Duyệt") {
        await TopicStudent.findByIdAndUpdate(id, { comment, stateReportProgress: "Phê duyệt" });
        res.status(200).send("Phê duyệt thành công.");
      }
      if (isApprove === "Từ chối") {
        if (comment) {
          await TopicStudent.findByIdAndUpdate(id, { comment, stateReportProgress: "Không phê duyệt" });
          res.status(200).send("Từ chối phê duyệt thành công.");
        } else {
          res.status(500).send("Bạn phải nhận xét trước khi Từ chối phê duyệt.");
        }
      }
    } catch (error) {
      res.status(500).send("Đã xảy ra lỗi.");
    }
  },
};

module.exports = approveReportProgressController;
