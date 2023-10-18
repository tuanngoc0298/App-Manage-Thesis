const Teacher = require("../models/Teacher");
const TopicStudent = require("../models/TopicStudent");
const Major = require("../models/Major");

const statisticsStudentController = {
  // GET
  getAllStatistics: async (req, res) => {
    try {
      const { searchQuery, year, department } = req.query;
      if (!year || !department) {
        return res.json([]);
      }
      const query = {};
      if (year) {
        query.yearTopic = year;
      }
      if (department) {
        query.nameDepartment = department;
      }
      if (searchQuery) {
        query.$or = [
          { code: { $regex: searchQuery, $options: "i" } },
          { name: { $regex: searchQuery, $options: "i" } },
        ];
      }

      const data1 = await Teacher.aggregate([
        {
          $match: {
            roleTeacher: "Giáo viên",
          },
        },
        {
          $lookup: {
            from: TopicStudent.collection.name,
            localField: "name",
            foreignField: "nameTeacher",
            as: "topicStudent",
          },
        },
        {
          $lookup: {
            from: Major.collection.name,
            localField: "nameMajor",
            foreignField: "nameMajor",
            as: "major",
          },
        },

        {
          $unwind: "$major", // Giải phóng các tài liệu từ mảng kết quả
        },
        {
          $project: {
            _id: 0,
            code: 1,
            name: 1,
            nameMajor: 1,
            nameDepartment: "$major.nameDepartment",
            studentsByYear: {
              $ifNull: [
                "$studentsByYear",
                [
                  { semesterTopic: "1", count: 0 },
                  { semesterTopic: "2", count: 0 },
                  { semesterTopic: "3", count: 0 },
                ],
              ],
            },
            totalStudents: { $ifNull: ["$totalStudents", 0] },
          },
        },

        {
          $match: {
            nameDepartment: department,
          },
        },
      ]);

      const data2 = await Teacher.aggregate([
        {
          $lookup: {
            from: TopicStudent.collection.name,
            localField: "name",
            foreignField: "nameTeacher",
            as: "topicStudent",
          },
        },
        {
          $unwind: "$topicStudent", // Giải phóng các tài liệu từ mảng kết quả
        },
        {
          $lookup: {
            from: Major.collection.name,
            localField: "nameMajor",
            foreignField: "nameMajor",
            as: "major",
          },
        },
        {
          $unwind: "$major", // Giải phóng các tài liệu từ mảng kết quả
        },
        {
          $group: {
            _id: {
              code: "$code",
              name: "$name",
              nameMajor: "$nameMajor",
              nameDepartment: "$major.nameDepartment",
              yearTopic: "$topicStudent.yearTopic",
              semesterTopic: "$topicStudent.semesterTopic",
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.yearTopic": 1,
            "_id.semesterTopic": 1,
          },
        },

        {
          $group: {
            _id: {
              code: "$_id.code",
              name: "$_id.name",
              nameMajor: "$_id.nameMajor",
              nameDepartment: "$_id.nameDepartment",
              yearTopic: "$_id.yearTopic",
            },
            studentsByYear: {
              $push: {
                semesterTopic: "$_id.semesterTopic",
                count: "$count",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            code: "$_id.code",
            name: "$_id.name",
            nameMajor: "$_id.nameMajor",
            nameDepartment: "$_id.nameDepartment",
            yearTopic: "$_id.yearTopic",
            studentsByYear: {
              $map: {
                input: ["1", "2", "3"],
                as: "semesterIndex",
                in: {
                  $ifNull: [
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$studentsByYear",
                            as: "studentYear",
                            cond: { $eq: ["$$studentYear.semesterTopic", "$$semesterIndex"] },
                          },
                        },
                        0,
                      ],
                    },
                    { semesterTopic: "$$semesterIndex", count: 0 },
                  ],
                },
              },
            },
            totalStudents: {
              $sum: "$studentsByYear.count",
            },
          },
        },

        {
          $match: query,
        },
      ]);
      const mergedData = data1.map((item1) => {
        const matchingItem = data2.find((item2) => item1.code === item2.code);
        return matchingItem ? matchingItem : item1;
      });
      const data = mergedData.sort((a, b) => {
        const nameA = a.nameMajor.toLowerCase(); // Chuyển về chữ thường và lưu trong biến nameA
        const nameB = b.nameMajor.toLowerCase(); // Chuyển về chữ thường và lưu trong biến nameB

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

module.exports = statisticsStudentController;
