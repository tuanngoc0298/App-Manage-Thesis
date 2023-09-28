// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const assignTeacherController = require("../../controllers/HeadMajor/assignTeacherController");

router.get("/assignTeachers", assignTeacherController.getAllStudentsNeedAssign);

// Định nghĩa route sửa đề tài
router.put("/assignTeachers/:id", assignTeacherController.assignTeacher);

module.exports = router;
