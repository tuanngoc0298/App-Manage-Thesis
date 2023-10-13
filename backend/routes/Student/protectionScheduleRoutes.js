// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const protectionScheduleController = require("../../controllers/Student/protectionScheduleController");
// Định nghĩa route để get ra đề tài của ngành
router.get("/protectionSchedule", protectionScheduleController.getSchedule);

module.exports = router;
