// server/routes/departmentRoutes.js
const express = require("express");
const router = express.Router();

const statisticsStudentController = require("../controllers/statisticsStudentController");

// Định nghĩa route để lấy dữ liệu
router.get("/statisticsStudent", statisticsStudentController.getAllStatistics);

module.exports = router;
