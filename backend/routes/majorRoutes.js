// server/routes/majorRoutes.js
const express = require("express");
const router = express.Router();
const Major = require("../models/Major");

router.get("/majors", async (req, res) => {
  const { searchQuery } = req.query;
  try {
    if (searchQuery) {
      const majors = await Major.find({
        $or: [
          { nameDepartment: { $regex: searchQuery, $options: "i" } },
          { code: { $regex: searchQuery, $options: "i" } },
          { name: { $regex: searchQuery, $options: "i" } },
          { codeHead: { $regex: searchQuery, $options: "i" } },
          { nameHead: { $regex: searchQuery, $options: "i" } },
        ],
      });
      res.json(majors);
    } else {
      const majors = await Major.find();
      res.json(majors);
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tải danh sách ngành." });
  }
});

// Định nghĩa route để thêm ngành mới
router.post("/majors", async (req, res) => {
  const { nameDepartment, name, code, nameHead, codeHead } = req.body;
  const existingMajor = await Major.findOne({ $or: [{ name }, { code }] });

  if (existingMajor) {
    return res.status(400).json({ message: "Ngành đã tồn tại" });
  }
  try {
    const major = new Major({ nameDepartment, name, code, nameHead, codeHead });
    await major.save();
    res.status(201).json(major);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm ngành mới." });
  }
});

// Định nghĩa route sửa ngành
router.put("/majors/:id", async (req, res) => {
  const { nameDepartment, name, code, nameHead, codeHead } = req.body;
  const { id } = req.params;
  try {
    const major = await Major.findByIdAndUpdate(id, { nameDepartment, name, code, nameHead, codeHead }, { new: true });
    res.status(200).json(major);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi sửa ngành." });
  }
});

// Định nghĩa route xóa ngành
router.delete("/majors/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Major.findByIdAndRemove(id);
    res.json({ message: "Xóa ngành thành công!" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa ngành." });
  }
});
module.exports = router;
