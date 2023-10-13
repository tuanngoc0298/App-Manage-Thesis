const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const submitFinalReportController = require("../../controllers/Student/submitFinalReportController");

// Get topic
router.get("/submitFinalReport", submitFinalReportController.getReport);

// Upload file zip
router.post("/submitFinalReport", upload.single("file"), submitFinalReportController.uploadReport);

module.exports = router;
