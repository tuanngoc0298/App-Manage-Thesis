// server/routes/capstoneProjectRoutes.js
const express = require("express");
const router = express.Router();

const capstoneProjectController = require("../controllers/HeadDepartment/capstoneProjectController");

router.get("/capstoneProjects", capstoneProjectController.getAllCapstoneProjects);

// Định nghĩa route để thêm học phần KLTN mới
router.post("/capstoneProjects", capstoneProjectController.addCapstoneProject);

// Định nghĩa route sửa học phần KLTN
router.put("/capstoneProjects/:id", capstoneProjectController.editCapstoneProject);

// Định nghĩa route xóa học phần KLTN
router.delete("/capstoneProjects/:id", capstoneProjectController.deleteCapstoneProject);
module.exports = router;
