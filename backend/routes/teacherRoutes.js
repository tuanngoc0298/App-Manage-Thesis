// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacherController");

router.get("/teachers", teacherController.getAllTeachers);

// Định nghĩa route để thêm giáo viên mới
router.post("/teachers", teacherController.addTeacher);

// Định nghĩa route sửa giáo viên
router.put("/teachers/:id", teacherController.editTeacher);

// Định nghĩa route xóa giáo viên
router.delete("/teachers/:id", teacherController.deleteTeacher);
module.exports = router;
