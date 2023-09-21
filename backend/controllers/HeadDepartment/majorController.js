const Major = require("../../models/Major");

const majorController = {
  // GET
  getAllMajors: async (req, res) => {
    const { searchQuery } = req.query;
    try {
      if (searchQuery) {
        const majors = await Major.find({
          $or: [
            { nameDepartment: { $regex: searchQuery, $options: "i" } },
            { code: { $regex: searchQuery, $options: "i" } },
            { name: { $regex: searchQuery, $options: "i" } },
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
  },
  // Add
  addMajor: async (req, res) => {
    const { nameDepartment, name, code, nameHead } = req.body;
    const existingMajor = await Major.findOne({ $or: [{ name }, { code }] });

    if (existingMajor) {
      return res.status(400).json({ message: "Ngành đã tồn tại" });
    }
    try {
      const major = new Major({ nameDepartment, name, code, nameHead });
      await major.save();
      res.status(201).json(major);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi thêm ngành mới." });
    }
  },
  editMajor: async (req, res) => {
    const { nameDepartment, name, code, nameHead } = req.body;
    const { id } = req.params;
    const existingMajor = await Major.findOne({ _id: { $ne: id }, $or: [{ name }, { code }] });

    if (existingMajor) {
      return res.status(400).json({ message: "Ngành đã tồn tại" });
    }
    try {
      const major = await Major.findByIdAndUpdate(id, { nameDepartment, name, code, nameHead }, { new: true });
      res.status(200).json(major);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi sửa ngành." });
    }
  },
  deleteMajor: async (req, res) => {
    const { id } = req.params;

    try {
      await Major.findByIdAndRemove(id);
      res.json({ message: "Xóa ngành thành công!" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xóa ngành." });
    }
  },
};

module.exports = majorController;
