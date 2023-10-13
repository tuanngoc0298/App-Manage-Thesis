// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const seeScoreResultController = require("../../controllers/Student/seeScoreResultController");
// Định nghĩa route để get ra đề tài của ngành
router.get("/seeScoreResult", seeScoreResultController.getResult);

module.exports = router;
