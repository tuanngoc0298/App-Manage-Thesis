const TopicStudent = require("../../models/TopicStudent");
const Student = require("../../models/Student");

const jwt = require("jsonwebtoken");

const approveRegisterPresentController = {
  // GET
  getAllRegister: async (req, res) => {
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
            statePresentProject: "Đang chờ duyệt",
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
            fileFinal: 1,
            commentFinal: 1,
          },
        },
        {
          $match: query,
        },
      ]);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải đăng ký bảo vệ" });
    }
  },

  // IMPORT
  downLoadFile: async (req, res) => {
    const { id } = req.params;

    try {
      const report = await TopicStudent.findById(id);
      if (!report) {
        res.status(404).send("Không tìm thấy đăng ký bảo vệ cho  sinh viên này.");
        return;
      }
      const { nameFile, data } = report.fileFinal;
      // Thiết lập đối tượng tệp để tải xuống
      res.setHeader("Content-Disposition", `attachment; filename=${nameFile}`);
      res.setHeader("Content-Type", "application/zip");
      res.send(data);
    } catch (error) {
      res.status(500).send("Đã xảy ra lỗi.");
    }
  },
  approveRegisterPresent: async (req, res) => {
    const { id } = req.params;
    const { isApprove, commentFinal } = req.body;
    try {
      if (isApprove === "Duyệt") {
        await TopicStudent.findByIdAndUpdate(id, { commentFinal, statePresentProject: "Phê duyệt" });
        res.status(200).send("Phê duyệt thành công.");
      }
      if (isApprove === "Từ chối") {
        if (commentFinal) {
          await TopicStudent.findByIdAndUpdate(id, { commentFinal, statePresentProject: "Không phê duyệt" });
          res.status(200).send("Từ chối phê duyệt thành công.");
        } else {
          res.status(500).send("Bạn phải nhận xét trước khi Từ chối phê duyệt.");
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Đã xảy ra lỗi.");
    }
  },
};

module.exports = approveRegisterPresentController;
