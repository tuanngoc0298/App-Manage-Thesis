// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const studentController = require("../controllers/studentController");

router.get("/students", studentController.getAllStudents);

// Import Student
router.post("/studentsUpload", upload.single("file"), studentController.importStudents);

// Định nghĩa route để thêm giáo viên mới
router.post("/students", studentController.addStudent);

// Định nghĩa route sửa giáo viên
router.put("/students/:id", studentController.editStudent);

// Định nghĩa route xóa giáo viên
router.delete("/students/:id", studentController.deleteStudent);
module.exports = router;
