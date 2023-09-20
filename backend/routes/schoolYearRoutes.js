// server/routes/schoolYearRoutes.js
const express = require("express");
const router = express.Router();

const schoolYearController = require("../controllers/schoolYearController");

router.get("/schoolYears", schoolYearController.getAllSchoolYears);

// Định nghĩa route để thêm năm học mới
router.post("/schoolYears", schoolYearController.addSchoolYear);

// Định nghĩa route sửa năm học
router.put("/schoolYears/:id", schoolYearController.editSchoolYear);

// Định nghĩa route xóa năm học
router.delete("/schoolYears/:id", schoolYearController.deleteSchoolYear);
module.exports = router;
