// server/routes/departmentRoutes.js
const express = require("express");
const router = express.Router();

const updateStateController = require("../../controllers/HeadMajor/updateStateController");

// Định nghĩa route để lấy dữ liệu
router.get("/updateState", updateStateController.getAllStudents);

// Định nghĩa route sửa khoa
router.put("/updateState/:id", updateStateController.updateState);

module.exports = router;
