// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const approveRevisedFinalReportController = require("../../controllers/Instructor/approveRevisedFinalReportController");

router.get("/approveRevisedFinalReport", approveRevisedFinalReportController.getAllLatestReports);

router.get("/approveRevisedReportDetail/:id", approveRevisedFinalReportController.getAllReportsDetail);
// Định nghĩa route downloadFile
router.get("/approveRevisedFinalReport/:id", approveRevisedFinalReportController.downLoadFile);

// Định nghĩa route add comment
router.put("/approveRevisedFinalReport/:id", approveRevisedFinalReportController.approveReportProgress);
module.exports = router;
