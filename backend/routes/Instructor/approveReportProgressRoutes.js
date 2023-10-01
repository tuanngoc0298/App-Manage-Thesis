// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const approveReportProgressController = require("../../controllers/Instructor/approveReportProgressController");

router.get("/approveReportProgess", approveReportProgressController.getAllReports);

// Định nghĩa route downloadFile
router.get("/approveReportProgess/:id", approveReportProgressController.downLoadFile);

// Định nghĩa route add comment
router.put("/approveReportProgess/:id", approveReportProgressController.approveReportProgress);
module.exports = router;
