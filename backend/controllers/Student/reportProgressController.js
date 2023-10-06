const TopicStudent = require("../../models/TopicStudent");
const Report = require("../../models/Report");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const reportProgressController = {
  // GET
  getTopic: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { code: codeStudent } = decoded.userInfo;

      const data = await Report.find({ codeStudent }).sort({ time: -1 });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải đề tài" });
    }
  },

  // IMPORT
  uploadReport: async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { code: codeStudent } = decoded.userInfo;
    const { valCompleteLevel, nameFile } = req.body;
    try {
      if (valCompleteLevel <= 0 || valCompleteLevel > 100 || isNaN(valCompleteLevel))
        return res.status(500).send("Mức độ hoàn thành là số trong khoảng 0-100%.");

      const hasTopic = await TopicStudent.exists({ codeStudent });

      const hasCompleteReport = await Report.exists({
        $and: [{ completeLevel: "100%" }, { stateReportProgress: "Đã được phê duyệt" }, { codeStudent }],
      });
      const hasPending = await Report.exists({
        $and: [{ stateReportProgress: "Đang chờ duyệt" }, { codeStudent }],
      });
      if (!hasTopic) return res.status(500).send("Bạn phải đăng ký đề tài trước.");

      if (hasCompleteReport) return res.status(500).send("Bạn đã hoàn thành báo cáo.");

      if (hasPending) return res.status(500).send("Bạn phải chờ kết quả duyệt trước khi tiếp tục báo cáo.");

      const reportFile = req.file.buffer;
      const file = {
        nameFile,
        data: reportFile,
      };
      const report = new Report({
        codeStudent,
        completeLevel: `${valCompleteLevel}%`,
        file,
        stateReportProgress: "Đang chờ duyệt",
        time: moment().format("dddd, D MMMM YYYY, h:mm A"),
      });
      await report.save();
      res.status(200).send("Báo cáo đã được tải lên và lưu trữ.");
    } catch (error) {
      console.log(error);
      res.status(500).send("Đã xảy ra lỗi.");
    }
  },
};

module.exports = reportProgressController;
