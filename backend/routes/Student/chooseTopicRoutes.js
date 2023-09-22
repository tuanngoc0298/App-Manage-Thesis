// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const chooseTopicController = require("../../controllers/Student/chooseTopicController");
// Định nghĩa route để get ra đề tài của ngành
router.get("/topicsByMajor", chooseTopicController.getTopicsByMajor);
// Định nghĩa route để get ra đề tài đã đăng ký
router.get("/chooseTopics", chooseTopicController.getChooseTopic);

// Định nghĩa route để đăng ký đề tài
router.put("/chooseTopics/:id", chooseTopicController.registerTopic);
router.delete("/chooseTopics/:id", chooseTopicController.cancleRegisterTopic);

module.exports = router;
