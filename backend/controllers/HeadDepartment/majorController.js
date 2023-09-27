const Major = require("../../models/Major");
const Teacher = require("../../models/Teacher");
const majorController = {
  // GET
  getAllMajors: async (req, res) => {
    try {
      const { searchQuery, major } = req.query;
      if (major) {
        const dataMajor = await Major.findOne({ nameMajor: major });
        const majorsByDepartment = await Major.find({ nameDepartment: dataMajor.nameDepartment });
        return res.status(200).json(majorsByDepartment);
      }
      const query = {};
      if (searchQuery) {
        query.$or = [
          { nameDepartment: { $regex: searchQuery, $options: "i" } },
          { codeMajor: { $regex: searchQuery, $options: "i" } },
          { nameMajor: { $regex: searchQuery, $options: "i" } },
          { nameHeadMajor: { $regex: searchQuery, $options: "i" } },
        ];
      }
      const data = await Major.find(query);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi tải danh sách ngành." });
    }
  },

  // Add
  addMajor: async (req, res) => {
    try {
      const { nameDepartment, nameMajor, codeMajor } = req.body;
      const existingMajor = await Major.findOne({ $or: [{ nameMajor }, { codeMajor }] });
      console.log(nameMajor);
      if (existingMajor) {
        return res.status(400).json({ message: "Ngành đã tồn tại" });
      }
      const headMajor = await Teacher.findOne({ $and: [{ roleTeacher: "Trưởng ngành" }, { nameMajor: nameMajor }] });
      const major = new Major({
        nameDepartment,
        nameMajor,
        codeMajor,
        nameHeadMajor: headMajor ? headMajor.nameTeacher : "",
      });
      await major.save();
      res.status(201).json(major);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi thêm ngành mới." });
    }
  },
  editMajor: async (req, res) => {
    try {
      const { nameDepartment, nameMajor, codeMajor } = req.body;
      const { id } = req.params;
      const existingMajor = await Major.findOne({ _id: { $ne: id }, $or: [{ nameMajor }, { codeMajor }] });

      if (existingMajor) {
        return res.status(400).json({ message: "Ngành đã tồn tại" });
      }

      const headMajor = await Teacher.findOne({ $and: [{ roleTeacher: "Trưởng ngành" }, { nameMajor: nameMajor }] });
      const major = await Major.findByIdAndUpdate(
        id,
        { nameDepartment, nameMajor, codeMajor, nameHeadMajor: headMajor ? headMajor.nameTeacher : "" },
        { new: true }
      );

      res.status(200).json(major);
    } catch (error) {
      console.log(error);
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
