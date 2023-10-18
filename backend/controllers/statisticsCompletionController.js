const Major = require("../models/Major");
const Student = require("../models/Student");

const statisticsCompletionController = {
  // GET
  getAllStatistics: async (req, res) => {
    try {
      const { searchQuery, year, semester, department } = req.query;
      if (!year || !semester) {
        return res.json([]);
      }
      const query = {};
      if (year) {
        query.year = year;
      }
      if (semester) {
        query.semester = semester;
      }
      if (department) {
        query.nameDepartment = department;
      }
      if (searchQuery) {
        query.$or = [
          { nameDepartment: { $regex: searchQuery, $options: "i" } },
          { nameMajor: { $regex: searchQuery, $options: "i" } },
        ];
      }

      const data = await Major.aggregate([
        {
          $lookup: {
            from: Student.collection.name,
            localField: "nameMajor",
            foreignField: "nameMajor",
            as: "student",
          },
        },
        {
          $unwind: "$student", // Giải phóng các tài liệu từ mảng kết quả
        },
        {
          $group: {
            _id: {
              nameMajor: "$nameMajor",
              nameDepartment: "$nameDepartment",
              year: "$student.year",
              semester: "$student.semester",
            },
            totalStudents: { $sum: 1 },
            totalCompletedStudents: {
              $sum: { $cond: [{ $eq: ["$student.state", "Hoàn thành KLTN"] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            nameMajor: "$_id.nameMajor",
            nameDepartment: "$_id.nameDepartment",
            year: "$_id.year",
            semester: "$_id.semester",
            totalStudents: 1,
            totalCompletedStudents: 1,
            completionRate: {
              $concat: [
                { $toString: { $multiply: [{ $divide: ["$totalCompletedStudents", "$totalStudents"] }, 100] } },
                "%",
              ],
            },
          },
        },
        {
          $match: query,
        },
        {
          $sort: {
            nameDepartment: 1,
          },
        },
      ]);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi tải báo cáo." });
    }
  },
};

module.exports = statisticsCompletionController;
