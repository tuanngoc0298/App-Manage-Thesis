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
      const query1 = {};

      if (year) {
        query.year = year;
      }
      if (semester) {
        query.semester = semester;
      }
      if (department) {
        query.nameDepartment = department;
        query1.nameDepartment = department;
      }
      if (searchQuery) {
        query.$or = [
          { nameDepartment: { $regex: searchQuery, $options: "i" } },
          { nameMajor: { $regex: searchQuery, $options: "i" } },
        ];
        query1.$or = [
          { nameDepartment: { $regex: searchQuery, $options: "i" } },
          { nameMajor: { $regex: searchQuery, $options: "i" } },
        ];
      }
      const data1 = await Major.aggregate([
        {
          $lookup: {
            from: Student.collection.name,
            localField: "nameMajor",
            foreignField: "nameMajor",
            as: "student",
          },
        },

        {
          $project: {
            _id: 0,
            nameMajor: 1,
            nameDepartment: 1,

            totalStudents: { $ifNull: ["$totalStudents", 0] },
            totalCompletedStudents: { $ifNull: ["$totalCompletedStudents", 0] },
            completionRate: "0%",
          },
        },
        {
          $match: query1,
        },
      ]);
      const data2 = await Major.aggregate([
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
                {
                  $toString: {
                    $round: [{ $multiply: [{ $divide: ["$totalCompletedStudents", "$totalStudents"] }, 100] }, 2],
                  },
                },
                "%",
              ],
            },
          },
        },
        {
          $match: query,
        },
      ]);
      const mergedData = data1.map((item1) => {
        const matchingItem = data2.find((item2) => item1.nameMajor === item2.nameMajor);
        return matchingItem ? matchingItem : item1;
      });
      const data = mergedData.sort((a, b) => {
        const nameA = a.nameDepartment.toLowerCase(); // Chuyển về chữ thường và lưu trong biến nameA
        const nameB = b.nameDepartment.toLowerCase(); // Chuyển về chữ thường và lưu trong biến nameB

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi tải báo cáo." });
    }
  },
};

module.exports = statisticsCompletionController;
