// server/routes/permissionRoutes.js
const express = require("express");
const router = express.Router();

const permissionController = require("../../controllers/Admin/permissionController");

// Định nghĩa route để lấy dữ liệu
router.get("/permissions", permissionController.getAllPermissions);

// Định nghĩa route để thêm khoa mới
router.post("/permissions", permissionController.addPermission);

// Định nghĩa route sửa khoa
router.put("/permissions/:id", permissionController.editPermission);

// Định nghĩa route xóa khoa
router.delete("/permissions/:id", permissionController.deletePermission);
module.exports = router;
