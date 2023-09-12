// server/routes/departmentRoutes.js
const express = require("express");
const router = express.Router();
const Department = require("../models/Department");

// Định nghĩa route để lấy dữ liệu
router.get("/departments", async (req, res) => {
  const { searchQuery } = req.query;
  try {
    if (searchQuery) {
      const departments = await Department.find({
        $or: [{ code: { $regex: searchQuery, $options: "i" } }, { name: { $regex: searchQuery, $options: "i" } }],
      });
      res.json(departments);
    } else {
      const departments = await Department.find();
      res.json(departments);
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tải danh sách khoa." });
  }
});

// Định nghĩa route để thêm khoa mới
router.post("/departments", async (req, res) => {
  const { name, code } = req.body;
  const existingDepartment = await Department.findOne({ $or: [{ name }, { code }] });

  if (existingDepartment) {
    return res.status(400).json({ error: "Khoa đã tồn tại" });
  }

  try {
    const department = new Department({ name, code });
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm khoa mới." });
  }
});

// Định nghĩa route sửa khoa
router.put("/departments/:id", async (req, res) => {
  const { name, code } = req.body;
  const { id } = req.params;
  try {
    const department = await Department.findByIdAndUpdate(id, { name, code }, { new: true });
    res.status(200).json(department);
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
