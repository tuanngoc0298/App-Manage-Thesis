// server/routes/departmentRoutes.js
const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const feedbackController = require("../../controllers/Instructor/feedbackController");

// Định nghĩa route để lấy dữ liệu
router.get("/feedback", feedbackController.getAllStudents);

// Định nghĩa route downloadFile
router.get("/feedback/:id", feedbackController.downLoadFile);

// Định nghĩa route sửa khoa
router.put("/feedback/:id", upload.single("file"), feedbackController.editFeedback);

module.exports = router;
