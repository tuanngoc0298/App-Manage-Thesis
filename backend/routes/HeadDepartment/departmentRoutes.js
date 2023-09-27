// server/routes/departmentRoutes.js
const express = require("express");
const router = express.Router();

const departmentController = require("../../controllers/HeadDepartment/departmentController");

// Định nghĩa route để lấy dữ liệu
router.get("/departments", departmentController.getAllDepartments);

// Định nghĩa route để thêm khoa mới
router.post("/departments", departmentController.addDepartment);

// Định nghĩa route sửa khoa
router.put("/departments/:id", departmentController.editDepartment);

// Định nghĩa route xóa khoa
router.delete("/departments/:id", departmentController.deleteDepartment);
module.exports = router;
