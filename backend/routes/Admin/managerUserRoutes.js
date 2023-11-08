// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const manageUserController = require("../../controllers/Admin/manageUserController");

router.get("/managerUsers", manageUserController.getAllUsers);

// Định nghĩa route để thêm đề tài mới
router.post("/managerUsers", manageUserController.addUser);

// Import đề tài
router.post("/managerUsersUpload", upload.single("file"), manageUserController.importUsers);

// Định nghĩa route sửa đề tài
router.put("/managerUsers/:id", manageUserController.editUser);

// Định nghĩa route xóa đề tài
router.delete("/managerUsers/:id", manageUserController.deleteUser);
module.exports = router;
