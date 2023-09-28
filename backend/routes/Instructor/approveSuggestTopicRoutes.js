// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const approveSuggestTopicController = require("../../controllers/Instructor/approveSuggestTopicController");

router.get("/approveSuggesttopics", approveSuggestTopicController.getAllSuggestTopics);

// Định nghĩa route sửa đề tài
router.put("/approveSuggesttopics/:id", approveSuggestTopicController.approveSuggestTopic);

module.exports = router;
