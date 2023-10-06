// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const assignCounterTeacherController = require("../../controllers/HeadMajor/assignCounterTeacherController");

router.get("/assignCounterTeachers", assignCounterTeacherController.getAllStudentsNeedAssign);

// Định nghĩa route sửa đề tài
router.put("/assignCounterTeachers/:id", assignCounterTeacherController.assignCounterTeacher);

module.exports = router;
