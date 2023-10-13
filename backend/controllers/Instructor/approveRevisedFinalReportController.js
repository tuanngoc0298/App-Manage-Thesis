const TopicStudent = require("../../models/TopicStudent");
const FinalReport = require("../../models/FinalReport");
const Student = require("../../models/Student");

const jwt = require("jsonwebtoken");

const approveRevisedFinalReportController = {
  // GET
  getAllLatestReports: async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { name } = decoded.userInfo;

    try {
      const { searchQuery, year, semester, stateApprove } = req.query;
      const query = {
        $or: [
          { nameTeacher: name },
          { nameCounterTeacher: name },
          { chairperson: name },
          { secretary: name },
          { commissioner: name },
        ],
      };
      let stateReport;
      if (stateApprove) {
        stateReport = { $ne: "Đang chờ duyệt" };
      } else {
        stateReport = "Đang chờ duyệt";
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
          { nameTopic: { $regex: searchQuery, $options: "i" } },
        ];
      }

      const data = await FinalReport.aggregate([
        { $sort: { codeStudent: 1, time: -1 } },
        { $match: { stateReportProgress: stateReport } },
        {
          $group: {
            _id: "$codeStudent",
            latestReport: { $first: "$$ROOT" }, // Chọn bản ghi report mới nhất từ mỗi nhóm
          },
        },

        {
          $lookup: {
            from: TopicStudent.collection.name,
            localField: "_id",
            foreignField: "codeStudent",
            as: "topic",
          },
        },
        {
          $unwind: "$topic",
        },
        {
          $lookup: {
            from: Student.collection.name,
            localField: "_id",
            foreignField: "code",
            as: "student",
          },
        },
        {
          $unwind: "$student",
        },
        {
          $project: {
            _id: "$latestReport._id",
            codeStudent: "$latestReport.codeStudent",
            nameStudent: "$student.name",
            nameTopic: "$topic.nameTopic",
            yearTopic: "$topic.yearTopic",
            nameCouncil: "$topic.protectionCouncil.nameCouncil",
            semesterTopic: "$topic.semesterTopic",
            comment: "$latestReport.comment",
            file: "$latestReport.file",
            stateReportProgress: "$latestReport.stateReportProgress",
            time: "$latestReport.time",

            nameTeacher: "$topic.nameTeacher",
            nameCounterTeacher: "$topic.nameCounterTeacher",
            chairperson: "$topic.protectionCouncil.members.chairperson",
            secretary: "$topic.protectionCouncil.members.secretary",
            commissioner: "$topic.protectionCouncil.members.commissioner",
          },
        },
        {
          $match: query,
        },
      ]);

      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi tải báo cáo tiến độ" });
    }
  },
  getAllReportsDetail: async (req, res) => {
    try {
      if (req.params.id) {
        const { id } = req.params;
        const reportsDetail = await FinalReport.findById(id);
        const data = await FinalReport.find({
          codeStudent: reportsDetail.codeStudent,
          stateReportProgress: { $ne: "Đang chờ duyệt" },
        }).sort({ time: 1 });

        res.status(200).json(data);
      } else {
        res.status(500).json("Không thể tải chi tiết báo cáo.");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Không thể tải chi tiết báo cáo.");
    }
  },
  // IMPORT
  downLoadFile: async (req, res) => {
    const { id } = req.params;

    try {
      const report = await FinalReport.findById(id);
      if (!report) {
        res.status(404).send("Không tìm thấy báo cáo cho mã sinh viên này.");
        return;
      }
      const { nameFile, data } = report.file;
      // Thiết lập đối tượng tệp để tải xuống
      res.setHeader("Content-Disposition", `attachment; filename=${nameFile}`);
      res.setHeader("Content-Type", "application/octet-stream");
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
        await FinalReport.findByIdAndUpdate(id, { comment, stateReportProgress: "Đã được phê duyệt" });
        res.status(200).send("Phê duyệt thành công.");
      }
      if (isApprove === "Từ chối") {
        if (comment) {
          await FinalReport.findByIdAndUpdate(id, { comment, stateReportProgress: "Không phê duyệt" });
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

module.exports = approveRevisedFinalReportController;
