const FinalReport = require("../../models/FinalReport");
const TopicStudent = require("../../models/TopicStudent");

const jwt = require("jsonwebtoken");
const moment = require("moment");

const submitFinalReportController = {
  // GET
  getReport: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { code: codeStudent } = decoded.userInfo;

      const data = await FinalReport.find({ codeStudent }).sort({ time: -1 });

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải báo cáo" });
    }
  },

  // IMPORT
  uploadReport: async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { code: codeStudent } = decoded.userInfo;
    const { nameFile } = req.body;
    try {
      const hasTopic = await TopicStudent.findOne({ codeStudent, feedback: { $exists: true } });
      const hasCompleteReport = await FinalReport.exists({
        stateReportProgress: "Đã được phê duyệt",
        codeStudent,
      });
      const hasReport = await FinalReport.exists({ codeStudent, stateReportProgress: "Đang chờ duyệt" });

      if (!hasTopic) return res.status(500).send("Bạn phải chờ nhận xét trước.");

      if (hasReport) return res.status(500).send("Bạn phải chờ kết quả báo cáo trước đó.");

      if (hasCompleteReport) return res.status(500).send("Bạn đã hoàn thành báo cáo.");
      const reportFile = req.file.buffer;
      const file = {
        nameFile,
        data: reportFile,
      };
      let state;
      if (hasTopic.feedback.stateFeedback === "Cần chỉnh sửa") state = "Đang chờ duyệt";
      else state = "Đã được phê duyệt";

      const report = new FinalReport({
        codeStudent,
        file,
        stateReportProgress: state,
      });
      await report.save();
      res.status(200).send("Báo cáo đã được tải lên và lưu trữ.");
    } catch (error) {
      console.log(error);
      res.status(500).send("Đã xảy ra lỗi.");
    }
  },
};

module.exports = submitFinalReportController;
