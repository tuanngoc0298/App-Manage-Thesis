// server/routes/thesisModuleRoutes.js
const express = require("express");
const router = express.Router();
const ThesisModule = require("../models/ThesisModule");

router.get("/thesisModules", async (req, res) => {
  const { searchQuery } = req.query;
  try {
    if (searchQuery) {
      const thesisModules = await ThesisModule.find({
        $or: [
          { nameMajor: { $regex: searchQuery, $options: "i" } },
          { code: { $regex: searchQuery, $options: "i" } },
          { name: { $regex: searchQuery, $options: "i" } },
          { credit: { $regex: searchQuery, $options: "i" } },
        ],
      });
      res.json(thesisModules);
    } else {
      const thesisModules = await ThesisModule.find();
      res.json(thesisModules);
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tải danh sách học phần KLTN." });
  }
});

// Định nghĩa route để thêm học phần KLTN mới
router.post("/thesisModules", async (req, res) => {
  const { nameMajor, name, code, credit } = req.body;
  const existingThesisModule = await ThesisModule.findOne({ $or: [{ name }, { code }] });

  if (existingThesisModule) {
    return res.status(400).json({ message: "Học phần KLTN đã tồn tại" });
  }
  try {
    const thesisModule = new ThesisModule({ nameMajor, name, code, credit });
    await thesisModule.save();
    res.status(201).json(thesisModule);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm học phần KLTN mới." });
  }
});

// Định nghĩa route sửa học phần KLTN
router.put("/thesisModules/:id", async (req, res) => {
  const { nameMajor, name, code, credit } = req.body;
  const { id } = req.params;
  const existingThesisModule = await ThesisModule.findOne({ _id: { $ne: id }, $or: [{ name }, { code }] });

  if (existingThesisModule) {
    return res.status(400).json({ message: "Học phần KLTN đã tồn tại" });
  }
  try {
    const thesisModule = await ThesisModule.findByIdAndUpdate(id, { nameMajor, name, code, credit }, { new: true });
    res.status(200).json(thesisModule);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi sửa học phần KLTN." });
  }
});

// Định nghĩa route xóa học phần KLTN
router.delete("/thesisModules/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await ThesisModule.findByIdAndRemove(id);
    res.json({ message: "Xóa học phần KLTN thành công!" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa học phần KLTN." });
  }
});
module.exports = router;
