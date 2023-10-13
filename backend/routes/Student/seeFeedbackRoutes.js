const express = require("express");
const router = express.Router();

const seeFeedbackController = require("../../controllers/Student/seeFeedbackController");

router.get("/seeFeedback", seeFeedbackController.getFeedback);
// Định nghĩa route downloadFile
router.get("/seeFeedback/:id", seeFeedbackController.downLoadFile);

module.exports = router;
