// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();

const approveRegisterPresentController = require("../../controllers/Instructor/approveRegisterPresentController");

router.get("/approveRegisterPresent", approveRegisterPresentController.getAllRegister);

// Định nghĩa route downloadFile
router.get("/approveRegisterPresent/:id", approveRegisterPresentController.downLoadFile);

// Định nghĩa route add comment
router.put("/approveRegisterPresent/:id", approveRegisterPresentController.approveRegisterPresent);
module.exports = router;
