const TopicStudent = require("../../models/TopicStudent");
const Student = require("../../models/Student");
const Topic = require("../../models/Topic");

const jwt = require("jsonwebtoken");

const updateResultController = {
  // GET
  getAllStudents: async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);

      const { searchQuery, year, semester, isTabResult } = req.query;
      const { name } = decoded.userInfo;

      const query = isTabResult
        ? { scoreByRole: { $exists: true } }
        : {
            scoreByRole: { $exists: false },
          };
      const condition = isTabResult ? { scoreResult: { $exists: true } } : { feedback: { $exists: true } };
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
            nameCouncil: "$protectionCouncil.nameCouncil",
            nameTeacher: 1,
            nameCounterTeacher: 1,
            chairperson: "$protectionCouncil.members.chairperson",
            secretary: "$protectionCouncil.members.secretary",
            commissioner: "$protectionCouncil.members.commissioner",
            yearTopic: 1,
            semesterTopic: 1,
            scoreResult: 1,
            state: "$student.state",

            scoreByRole: {
              $switch: {
                branches: [
                  { case: { $eq: ["$nameTeacher", name] }, then: "$scoreResult.teacher" },
                  { case: { $eq: ["$nameCounterTeacher", name] }, then: "$scoreResult.counterTeacher" },
                  { case: { $eq: ["$protectionCouncil.members.chairperson", name] }, then: "$scoreResult.chairperson" },
                  { case: { $eq: ["$protectionCouncil.members.secretary", name] }, then: "$scoreResult.secretary" },
                  {
                    case: { $eq: ["$protectionCouncil.members.commissioner", name] },
                    then: "$scoreResult.commissioner",
                  },
                ],
                default: null,
              },
            },
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

  // EDIT
  editResult: async (req, res) => {
    try {
      const { id } = req.params;

      const {
        scores,
        total,
        scoresTeacher,
        totalTeacher,
        scoresCounterTeacher,
        totalCounterTeacher,
        scoresChairperson,
        totalChairperson,
        scoresCommissioner,
        totalCommissioner,
        role,
        editResult: { state },
      } = req.body;
      if (state === "Hoàn thành KLTN" || state === "Không hoàn thành KLTN")
        return res.status(500).json({ error: "Bạn không thể sửa!" });
      if (role !== "secretary") {
        if (scores.length !== 5 || scores.includes(null))
          return res.status(500).json({ error: "Vui lòng nhập đầy đủ điểm đánh giá !" });
        if (scores.some((item) => item < 0 || item > 2))
          return res.status(500).json({ error: "Điểm phải > 0 và < Điểm tối đa !" });

        const updateObj = {};
        updateObj[`scoreResult.${role}`] = { scores, total };
        await TopicStudent.findByIdAndUpdate(id, updateObj, { new: true });
      } else {
        if (
          scores.length !== 5 ||
          scores.includes(null) ||
          scoresTeacher.length !== 5 ||
          scoresTeacher.includes(null) ||
          scoresCounterTeacher.length !== 5 ||
          scoresCounterTeacher.includes(null) ||
          scoresChairperson.length !== 5 ||
          scoresChairperson.includes(null) ||
          scoresCommissioner.length !== 5 ||
          scoresCommissioner.includes(null)
        )
          return res.status(500).json({ error: "Vui lòng nhập đầy đủ điểm đánh giá !" });
        if (
          scores.some((item) => item < 0 || item > 2) ||
          scoresTeacher.some((item) => item < 0 || item > 2) ||
          scoresCounterTeacher.some((item) => item < 0 || item > 2) ||
          scoresChairperson.some((item) => item < 0 || item > 2) ||
          scoresCommissioner.some((item) => item < 0 || item > 2)
        )
          return res.status(500).json({ error: "Điểm phải > 0 và < Điểm tối đa !" });

        const scoreResult = {
          teacher: { scores: scoresTeacher, total: totalTeacher },
          counterTeacher: { scores: scoresCounterTeacher, total: totalCounterTeacher },
          chairperson: { scores: scoresChairperson, total: totalChairperson },
          secretary: { scores, total },
          commissioner: { scores: scoresCommissioner, total: totalCommissioner },
        };

        await TopicStudent.findByIdAndUpdate(id, { scoreResult }, { new: true });
      }
      const result = await TopicStudent.findById(id);
      if (
        result.scoreResult?.teacher?.total &&
        result.scoreResult?.counterTeacher?.total &&
        result.scoreResult?.chairperson?.total &&
        result.scoreResult?.secretary?.total &&
        result.scoreResult?.commissioner?.total
      ) {
        const { teacher, counterTeacher, chairperson, secretary, commissioner } = result.scoreResult;
        const average =
          (teacher.total + counterTeacher.total + chairperson.total + secretary.total + commissioner.total) / 5;
        await TopicStudent.findByIdAndUpdate(id, { "scoreResult.average": average.toFixed(1) }, { new: true });
      }
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi sửa Điểm." });
    }
  },
};

module.exports = updateResultController;
