const Teacher = require("../../models/Teacher");
const Major = require("../../models/Major");
const Department = require("../../models/Department");
const jwt = require("jsonwebtoken");

const teacherController = {
  // GET
  getAllTeachers: async (req, res) => {
    const { searchQuery } = req.query;
    try {
      if (searchQuery) {
        const teachers = await Teacher.find({
          $or: [
            { nameMajor: { $regex: searchQuery, $options: "i" } },
            { code: { $regex: searchQuery, $options: "i" } },
            { name: { $regex: searchQuery, $options: "i" } },
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
  // Get all teachers by Department
  getAllTeachersByDepartment: async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { nameMajor } = decoded.userInfo;
    const major = await Major.findOne({ nameMajor });
    const { nameTeacher } = req.query;
    try {
      Department.findOne({ nameDepartment: major ? major.nameDepartment : "" })
        .then((department) => {
          if (!department) {
            console.error("Không tìm thấy khoa");
            return;
          }

          Major.find({ nameDepartment: department.nameDepartment })
            .then((majors) => {
              const nameMajors = majors.map((major) => major.nameMajor);
              Teacher.find({ nameMajor: { $in: nameMajors }, name: { $ne: nameTeacher } })
                .then((teachers) => {
                  res.status(200).json(teachers);
                })
                .catch((err) => {
                  res.status(500).json({ message: "Lỗi truy xuất giáo viên" });
                });
            })
            .catch((err) => {
              res.status(500).json({ message: "Lỗi truy xuất  ngành" });
            });
        })
        .catch((err) => {
          res.status(500).json({ message: "Lỗi truy xuất khoa" });
        });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách giáo viên." });
    }
  },
  // Add
  addTeacher: async (req, res) => {
    try {
      const { nameMajor, name, code, roleTeacher } = req.body;
      const existingTeacher = await Teacher.findOne({ $or: [{ name }, { code }] });

      if (existingTeacher) {
        return res.status(400).json({ message: "Giáo viên đã tồn tại" });
      }

      if (roleTeacher === "Trưởng ngành") {
        const duplicateHeadMajor = await Teacher.findOne({ $and: [{ nameMajor }, { roleTeacher: "Trưởng ngành" }] });
        if (duplicateHeadMajor) {
          return res.status(400).json({ message: "Mỗi ngành chỉ có 1 trưởng ngành" });
        }
        await Major.updateOne({ nameMajor }, { $set: { nameHeadMajor: name } });
      }
      const teacher = new Teacher({ nameMajor, name, code, roleTeacher });
      await teacher.save();
      res.status(201).json(teacher);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi thêm giáo viên mới." });
    }
  },
  editTeacher: async (req, res) => {
    try {
      const { initialValueComboBox } = req.body;
      const { nameMajor, name, code, roleTeacher } = req.body.editTeacher;
      const { id } = req.params;
      const existingTeacher = await Teacher.findOne({ _id: { $ne: id }, $or: [{ name }, { code }] });

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
        await Major.updateOne({ nameMajor }, { $set: { nameHeadMajor: name } });
      }

      if (initialValueComboBox === "Trưởng ngành") {
        if (roleTeacher !== "Trưởng ngành") {
          await Major.updateOne({ nameMajor }, { $set: { nameHeadMajor: "" } });
        }
      }
      const teacher = await Teacher.findByIdAndUpdate(id, { nameMajor, name, code, roleTeacher }, { new: true });
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
