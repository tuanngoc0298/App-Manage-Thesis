// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const instructedStudentController = require("../../controllers/Instructor/instructedStudentController");

router.get("/instructedStudents", instructedStudentController.getAllTopicStudents);

module.exports = router;
