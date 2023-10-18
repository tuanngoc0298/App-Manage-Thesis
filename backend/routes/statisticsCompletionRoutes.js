// server/routes/departmentRoutes.js
const express = require("express");
const router = express.Router();

const statisticsCompletionController = require("../controllers/statisticsCompletionController");

// Định nghĩa route để lấy dữ liệu
router.get("/statisticsCompletion", statisticsCompletionController.getAllStatistics);

module.exports = router;
