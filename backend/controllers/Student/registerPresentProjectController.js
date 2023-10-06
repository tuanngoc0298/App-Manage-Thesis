const TopicStudent = require("../../models/TopicStudent");
const Report = require("../../models/Report");

const jwt = require("jsonwebtoken");

const registerPresentProjectController = {
  // GET
  getRegister: async (req, res) => {
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
  uploadRegister: async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { code: codeStudent } = decoded.userInfo;
    try {
      const { nameFile } = req.body;
      const { id } = req.params;
      const report = await TopicStudent.findById(id);
      const conditionReport = Report.exists({
        codeStudent,
        stateReportProgress: "Đã được phê duyệt",
        completeLevel: "100%",
      });
      const { statePresentProject } = report;
      if (!conditionReport) return res.status(500).send("Bạn không đủ điều kiện Đăng ký bảo vệ");
      if (statePresentProject === "Đã được phê duyệt" || statePresentProject === "Được bảo vệ khóa luận")
        return res.status(500).send("Bạn đã được phê duyệt ");

      const reportFile = req.file.buffer;
      const fileFinal = {
        nameFile,
        data: reportFile,
      };
      await TopicStudent.findByIdAndUpdate(id, {
        fileFinal,
        statePresentProject: "Đang chờ duyệt",
        stateApproveProject: "Đang chờ duyệt",
      });
      res.status(200).send("Đăng ký bảo vệ thành công");
    } catch (error) {
      console.log(error);
      res.status(500).send("Đã xảy ra lỗi khi đăng ký bảo vệ.");
    }
  },
};

module.exports = registerPresentProjectController;
