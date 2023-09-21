const SchoolYear = require("../../models/SchoolYear");

const schoolYearController = {
  // GET
  getAllSchoolYears: async (req, res) => {
    const { searchQuery } = req.query;
    try {
      if (searchQuery) {
        const schoolYears = await SchoolYear.find({
          $or: [{ year: { $regex: searchQuery, $options: "i" } }, { semester: { $regex: searchQuery, $options: "i" } }],
        });
        res.json(schoolYears);
      } else {
        const schoolYears = await SchoolYear.find();
        res.json(schoolYears);
      }
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách năm học." });
    }
  },
  // Add
  addSchoolYear: async (req, res) => {
    const { year, semester } = req.body;
    const existingSchoolYear = await SchoolYear.findOne({ $and: [{ semester }, { year }] });

    if (existingSchoolYear) {
      return res.status(400).json({ message: "Năm học đã tồn tại" });
    }
    try {
      const schoolYear = new SchoolYear({ year, semester });
      await schoolYear.save();
      res.status(201).json(schoolYear);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi thêm năm học mới." });
    }
  },
  editSchoolYear: async (req, res) => {
    const { year, semester } = req.body;
    const { id } = req.params;
    const existingSchoolYear = await SchoolYear.findOne({ _id: { $ne: id }, $and: [{ semester }, { year }] });

    if (existingSchoolYear) {
      return res.status(400).json({ message: "Năm học đã tồn tại" });
    }
    try {
      const schoolYear = await SchoolYear.findByIdAndUpdate(id, { year, semester }, { new: true });
      res.status(200).json(schoolYear);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi sửa năm học." });
    }
  },
  deleteSchoolYear: async (req, res) => {
    const { id } = req.params;

    try {
      await SchoolYear.findByIdAndRemove(id);
      res.json({ message: "Xóa năm học thành công!" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xóa năm học." });
    }
  },
};

module.exports = schoolYearController;
