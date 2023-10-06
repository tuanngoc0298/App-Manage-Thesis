const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const reportProgressController = require("../../controllers/Student/reportProgressController");

// Get topic
router.get("/reportProgress", reportProgressController.getTopic);

// Upload file zip
router.post("/reportProgress", upload.single("file"), reportProgressController.uploadReport);

module.exports = router;
