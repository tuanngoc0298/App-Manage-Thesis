// server/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");

router.get("/teachers", async (req, res) => {
  const { searchQuery } = req.query;
  try {
    if (searchQuery) {
      const teachers = await Teacher.find({
        $or: [
          { nameMajor: { $regex: searchQuery, $options: "i" } },
          { code: { $regex: searchQuery, $options: "i" } },
          { name: { $regex: searchQuery, $options: "i" } },
          { role: { $regex: searchQuery, $options: "i" } },
        ],
      });
      res.json(teachers);
    } else {
      const teachers = await Teacher.find();
      res.json(teachers);
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tải danh sách giáo viên." });
  }
});

// Định nghĩa route để thêm giáo viên mới
router.post("/teachers", async (req, res) => {
  const { nameMajor, name, code, role } = req.body;
  const existingTeacher = await Teacher.findOne({ $or: [{ name }, { code }] });

  if (existingTeacher) {
    return res.status(400).json({ message: "Giáo viên đã tồn tại" });
  }
  try {
    const teacher = new Teacher({ nameMajor, name, code, role });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm giáo viên mới." });
  }
});

// Định nghĩa route sửa giáo viên
router.put("/teachers/:id", async (req, res) => {
  const { nameMajor, name, code, role } = req.body;
  const { id } = req.params;
  const existingTeacher = await Teacher.findOne({ _id: { $ne: id }, $or: [{ name }, { code }] });

  if (existingTeacher) {
    return res.status(400).json({ message: "Giáo viên đã tồn tại" });
  }
  try {
    const teacher = await Teacher.findByIdAndUpdate(id, { nameMajor, name, code, role }, { new: true });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi sửa giáo viên." });
  }
});

// Định nghĩa route xóa giáo viên
router.delete("/teachers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Teacher.findByIdAndRemove(id);
    res.json({ message: "Xóa giáo viên thành công!" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa giáo viên." });
  }
});
module.exports = router;
