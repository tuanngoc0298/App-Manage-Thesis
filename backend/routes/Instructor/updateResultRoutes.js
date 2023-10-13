// server/routes/departmentRoutes.js
const express = require("express");
const router = express.Router();

const updateResultController = require("../../controllers/Instructor/updateResultController");

// Định nghĩa route để lấy dữ liệu
router.get("/updateResult", updateResultController.getAllStudents);

// Định nghĩa route sửa khoa
router.put("/updateResult/:id", updateResultController.editResult);

module.exports = router;
