const TopicStudent = require("../../models/TopicStudent");

const jwt = require("jsonwebtoken");

const seeFeedbackController = {
  // GET
  getFeedback: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
      const { code: codeStudent } = decoded.userInfo;

      const data = await TopicStudent.findOne({ codeStudent, feedback: { $exists: true } });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải đề tài" });
    }
  },
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
};

module.exports = seeFeedbackController;
