const TopicStudent = require("../../models/TopicStudent");
const Topic = require("../../models/Topic");
const CapstoneProject = require("../../models/CapstoneProject");
const jwt = require("jsonwebtoken");
const SuggestTopic = require("../../models/SuggestTopic");

const seeScoreResultController = {
  getResult: async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { code } = decoded.userInfo;
    try {
      let schedule = await TopicStudent.aggregate([
        {
          $match: {
            codeStudent: code,
            scoreResult: { $exists: true },
          },
        },
        {
          $lookup: {
            from: Topic.collection.name,
            foreignField: "nameTopic",
            localField: "nameTopic",
            as: "topic",
          },
        },
        {
          $unwind: "$topic",
        },
        {
          $project: {
            _id: 1,
            scoreResult: 1,
            nameMajor: "$topic.nameMajor",
          },
        },
        {
          $lookup: {
            from: CapstoneProject.collection.name,
            foreignField: "nameMajor",
            localField: "nameMajor",
            as: "capstone",
          },
        },
        {
          $unwind: "$capstone",
        },
        {
          $project: {
            _id: 1,
            scoreResult: 1,
            codeCapstoneProject: "$capstone.codeCapstoneProject",
            nameCapstoneProject: "$capstone.nameCapstoneProject",
          },
        },
      ]);
      if (schedule.length === 0) {
        schedule = await TopicStudent.aggregate([
          {
            $match: {
              codeStudent: code,
              scoreResult: { $exists: true },
            },
          },
          {
            $lookup: {
              from: SuggestTopic.collection.name,
              foreignField: "nameTopic",
              localField: "nameTopic",
              as: "topic",
            },
          },
          {
            $unwind: "$topic",
          },
          {
            $project: {
              _id: 1,
              scoreResult: 1,
              nameMajor: "$topic.nameMajor",
            },
          },
          {
            $lookup: {
              from: CapstoneProject.collection.name,
              foreignField: "nameMajor",
              localField: "nameMajor",
              as: "capstone",
            },
          },
          {
            $unwind: "$capstone",
          },
          {
            $project: {
              _id: 1,
              scoreResult: 1,
              codeCapstoneProject: "$capstone.codeCapstoneProject",
              nameCapstoneProject: "$capstone.nameCapstoneProject",
            },
          },
        ]);
      }
      res.json(...schedule);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi khi tải điểm." });
    }
  },
};

module.exports = seeScoreResultController;
