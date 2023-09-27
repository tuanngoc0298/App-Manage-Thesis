const Teacher = require("../../models/Teacher");
const Major = require("../../models/Major");

const teacherController = {
  // GET
  getAllTeachers: async (req, res) => {
    const { searchQuery } = req.query;
    try {
      if (searchQuery) {
        const teachers = await Teacher.find({
          $or: [
            { nameMajor: { $regex: searchQuery, $options: "i" } },
            { codeTeacher: { $regex: searchQuery, $options: "i" } },
            { nameTeacher: { $regex: searchQuery, $options: "i" } },
            { roleTeacher: { $regex: searchQuery, $options: "i" } },
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
  },
  // Add
  addTeacher: async (req, res) => {
    try {
      const { nameMajor, nameTeacher, codeTeacher, roleTeacher } = req.body;
      const existingTeacher = await Teacher.findOne({ $or: [{ nameTeacher }, { codeTeacher }] });

      if (existingTeacher) {
        return res.status(400).json({ message: "Giáo viên đã tồn tại" });
      }

      if (roleTeacher === "Trưởng ngành") {
        const duplicateHeadMajor = await Teacher.findOne({ $and: [{ nameMajor }, { roleTeacher: "Trưởng ngành" }] });
        if (duplicateHeadMajor) {
          return res.status(400).json({ message: "Mỗi ngành chỉ có 1 trưởng ngành" });
        }
        await Major.updateOne({ nameMajor }, { $set: { nameHeadMajor: nameTeacher } });
      }
      const teacher = new Teacher({ nameMajor, nameTeacher, codeTeacher, roleTeacher });
      await teacher.save();
      res.status(201).json(teacher);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi thêm giáo viên mới." });
    }
  },
  editTeacher: async (req, res) => {
    try {
      const { initialValueComboBox } = req.body;
      const { nameMajor, nameTeacher, codeTeacher, roleTeacher } = req.body.editTeacher;
      const { id } = req.params;
      const existingTeacher = await Teacher.findOne({ _id: { $ne: id }, $or: [{ nameTeacher }, { codeTeacher }] });

      if (existingTeacher) {
        return res.status(400).json({ message: "Giáo viên đã tồn tại" });
      }
      if (roleTeacher === "Trưởng ngành") {
        const duplicateHeadMajor = await Teacher.findOne({
          _id: { $ne: id },
          $and: [{ nameMajor }, { roleTeacher: "Trưởng ngành" }],
        });
        if (duplicateHeadMajor) {
          return res.status(400).json({ message: "Mỗi ngành chỉ có 1 trưởng ngành" });
        }
        await Major.updateOne({ nameMajor }, { $set: { nameHeadMajor: nameTeacher } });
      }

      if (initialValueComboBox === "Trưởng ngành") {
        if (roleTeacher !== "Trưởng ngành") {
          await Major.updateOne({ nameMajor }, { $set: { nameHeadMajor: "" } });
        }
      }
      const teacher = await Teacher.findByIdAndUpdate(
        id,
        { nameMajor, nameTeacher, codeTeacher, roleTeacher },
        { new: true }
      );
      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi sửa giáo viên." });
    }
  },
  deleteTeacher: async (req, res) => {
    try {
      const { id } = req.params;
      const headMajor = await Teacher.findByIdAndRemove(id);
      if (headMajor.roleTeacher === "Trưởng ngành") {
        await Major.updateOne({ nameMajor: headMajor.nameMajor }, { $set: { nameHeadMajor: "" } });
      }
      res.json({ message: "Xóa giáo viên thành công!" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xóa giáo viên." });
    }
  },
};

module.exports = teacherController;
