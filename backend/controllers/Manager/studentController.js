const Student = require("../../models/Student");
const multer = require("multer");
const XLSX = require("xlsx");
const jwt = require("jsonwebtoken");

const studentController = {
  // GET
  getAllStudents: async (req, res) => {
    const { searchQuery } = req.query;
    try {
      if (searchQuery) {
        const students = await Student.find({
          $or: [
            { year: { $regex: searchQuery, $options: "i" } },
            { code: { $regex: searchQuery, $options: "i" } },
            { name: { $regex: searchQuery, $options: "i" } },
            { semester: { $regex: searchQuery, $options: "i" } },
            { major: { $regex: searchQuery, $options: "i" } },
            { state: { $regex: searchQuery, $options: "i" } },
          ],
        });
        res.json(students);
      } else {
        const students = await Student.find();
        res.json(students);
      }
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách học sinh." });
    }
  },
  // IMPORT
  importStudents: async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    let data = XLSX.utils.sheet_to_json(worksheet);
    let newData;
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);

    const { major } = decoded.userInfo;
    newData = data.map((item) => {
      return { ...item, major: major };
    });
    await Student.deleteMany({ major: major });
    // Lưu dữ liệu vào MongoDB
    await Student.insertMany(newData)
      .then(() => {
        res.status(200).json({ message: "Data imported successfully" });
      })
      .catch((error) => {
        res.status(500).json({ message: "Error importing data", error });
      });
  },
  // Add
  addStudent: async (req, res) => {
    const { year, name, code, semester, major, state } = req.body;
    const existingStudent = await Student.findOne({ $or: [{ name }, { code }] });

    if (existingStudent) {
      return res.status(400).json({ message: "Học sinh đã tồn tại" });
    }
    try {
      const student = new Student({ year, name, code, semester, major, state });
      await student.save();
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi thêm học sinh mới." });
    }
  },
  editStudent: async (req, res) => {
    const { year, name, code, semester, major, state } = req.body;
    const { id } = req.params;
    const existingStudent = await Student.findOne({ _id: { $ne: id }, $or: [{ name }, { code }] });

    if (existingStudent) {
      return res.status(400).json({ message: "Học sinh đã tồn tại" });
    }
    try {
      const student = await Student.findByIdAndUpdate(id, { year, name, code, semester, major, state }, { new: true });
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi sửa học sinh." });
    }
  },
  deleteStudent: async (req, res) => {
    const { id } = req.params;

    try {
      await Student.findByIdAndRemove(id);
      res.json({ message: "Xóa học sinh thành công!" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xóa học sinh." });
    }
  },
};

module.exports = studentController;
