const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const registerPresentProjectController = require("../../controllers/Student/registerPresentProjectController");

// Get topic
router.get("/registerPresent", registerPresentProjectController.getRegister);

// Upload file zip
router.put("/registerPresent/:id", upload.single("file"), registerPresentProjectController.uploadRegister);

module.exports = router;
