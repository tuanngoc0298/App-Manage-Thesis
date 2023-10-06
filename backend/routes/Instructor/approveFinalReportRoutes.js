// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const approveFinalReportController = require("../../controllers/Instructor/approveFinalReportController");

router.get("/approveFinalReport", approveFinalReportController.getAllFinalReports);

// Định nghĩa route downloadFile
router.get("/approveFinalReport/:id", approveFinalReportController.downLoadFile);

// Định nghĩa route add comment
router.put("/approveFinalReport/:id", approveFinalReportController.approveFinalReport);
module.exports = router;
