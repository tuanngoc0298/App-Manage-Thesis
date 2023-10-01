const TopicStudent = require("../../models/TopicStudent");

const jwt = require("jsonwebtoken");

const reportProgressController = {
  // GET
  getTopic: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { code: codeStudent } = decoded.userInfo;

      const data = await TopicStudent.findOne({ codeStudent });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải đề tài" });
    }
  },

  // IMPORT
  uploadReport: async (req, res) => {
    try {
      const { valCompleteLevel, nameFile } = req.body;

      const { id } = req.params;
      const report = await TopicStudent.findById(id);
      const { stateReportProgress, completeLevel, statePresentProject } = report;

      if (valCompleteLevel <= 0 || valCompleteLevel > 100 || isNaN(valCompleteLevel))
        return res.status(500).send("Mức độ hoàn thành là số trong khoảng 0-100%.");
      if (
        completeLevel === "100%" &&
        stateReportProgress === "Phê duyệt" &&
        statePresentProject !== "Không phê duyệt"
      ) {
        return res.status(500).send("Bạn đã hoàn thành báo cáo.");
      }

      const reportFile = req.file.buffer;
      const file = {
        nameFile,
        data: reportFile,
      };
      await TopicStudent.findByIdAndUpdate(id, {
        completeLevel: `${valCompleteLevel}%`,
        file,
        stateReportProgress: "Đang chờ duyệt",
        comment: "",
      });
      res.status(200).send("Báo cáo đã được tải lên và lưu trữ.");
    } catch (error) {
      console.log(error);
      res.status(500).send("Đã xảy ra lỗi.");
    }
  },
};

module.exports = reportProgressController;
