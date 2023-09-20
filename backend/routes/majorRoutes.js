// server/routes/majorRoutes.js
const express = require("express");
const router = express.Router();

const majorController = require("../controllers/majorController");
router.get("/majors", majorController.getAllMajors);

// Định nghĩa route để thêm ngành mới
router.post("/majors", majorController.addMajor);

// Định nghĩa route sửa ngành
router.put("/majors/:id", majorController.editMajor);

// Định nghĩa route xóa ngành
router.delete("/majors/:id", majorController.deleteMajor);
module.exports = router;
