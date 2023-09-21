// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const topicController = require("../../controllers/Instructor/topicController");

router.get("/topics", topicController.getAllTopics);

// Định nghĩa route để thêm đề tài mới
router.post("/topics", topicController.addTopic);

// Import đề tài
router.post("/topicsUpload", upload.single("file"), topicController.importTopics);

// Định nghĩa route sửa đề tài
router.put("/topics/:id", topicController.editTopic);

// Định nghĩa route xóa đề tài
router.delete("/topics/:id", topicController.deleteTopic);
module.exports = router;
