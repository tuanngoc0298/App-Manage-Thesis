// server/routes/departmentRoutes.js
const express = require("express");
const router = express.Router();

const establishCouncilController = require("../../controllers/HeadMajor/establishCouncilController");

// Định nghĩa route để lấy dữ liệu
router.get("/establishCouncil", establishCouncilController.getAllStudents);

// Định nghĩa route sửa khoa
router.put("/establishCouncil/:id", establishCouncilController.editCouncil);

module.exports = router;
