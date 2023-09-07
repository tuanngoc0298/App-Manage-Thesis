// server/routes/departmentRoutes.js
const express = require("express");
const router = express.Router();
const Department = require("../models/Department");

router.get("/departments", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tải danh sách khoa." });
  }
});

// Định nghĩa route để thêm khoa mới
router.post("/departments", async (req, res) => {
  const { name, code, head, students } = req.body;
  try {
    const department = new Department({ name, code, head, students });
    if (name && code && head && students) {
      await department.save();
      res.status(201).json(department);
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm khoa mới." });
  }
});

// Định nghĩa route sửa khoa
router.put("/departments/:id", async (req, res) => {
  const { name, code, head, students } = req.body;
  const { id } = req.params;

  try {
    const department = await Department.findByIdAndUpdate(id, { name, code, head, students }, { new: true });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi sửa khoa." });
  }
});

// Định nghĩa route xóa khoa
router.delete("/departments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Department.findByIdAndRemove(id);
    res.json({ message: "Xóa khoa thành công!" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa khoa." });
  }
});
module.exports = router;