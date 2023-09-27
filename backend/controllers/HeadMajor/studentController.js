const Student = require("../../models/Student");

const XLSX = require("xlsx");
const jwt = require("jsonwebtoken");

const studentController = {
  // GET
  getAllStudents: async (req, res) => {
    try {
      const { searchQuery, major, year, semester } = req.query;
      const query = {};
      if (major) {
        query.nameMajor = major;
      }
      if (year) {
        query.year = year;
      }
      if (semester) {
        query.semester = semester;
      }
      if (searchQuery) {
        query.$or = [
          { codeStudent: { $regex: searchQuery, $options: "i" } },
          { nameStudent: { $regex: searchQuery, $options: "i" } },
          { nameMajor: { $regex: searchQuery, $options: "i" } },
          { year: { $regex: searchQuery, $options: "i" } },
          { semester: { $regex: searchQuery, $options: "i" } },
          { state: { $regex: searchQuery, $options: "i" } },
        ];
      }
      const data = await Student.find(query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách Sinh Viên." });
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

    let datas = XLSX.utils.sheet_to_json(worksheet);
    // Lọc dữ liệu có đủ 4 trường thông tin
    datas = datas.map((data) => {
      if (!data.nameStudent || !data.codeStudent || !data.year || !data.semester) {
        return null;
      }

      const validData = {
        nameStudent: data.nameStudent,
        codeStudent: data.codeStudent,
        year: data.year,
        semester: data.semester,
      };
      return validData;
    });

    if (datas.includes(null)) return res.status(500).json({ message: "Error: Data thiếu dữ liệu" });

    let newData;
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { nameMajor } = decoded;

    newData = datas.map((item) => {
      return { ...item, nameMajor: nameMajor, state: "Đăng ký đề tài" };
    });
    await Student.deleteMany({ nameMajor: nameMajor });
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
    const { year, nameStudent, codeStudent, semester, nameMajor, state } = req.body;
    const existingStudent = await Student.findOne({ $or: [{ nameStudent }, { codeStudent }] });

    if (existingStudent) {
      return res.status(400).json({ message: "Học sinh đã tồn tại" });
    }
    try {
      const student = new Student({ year, nameStudent, codeStudent, semester, nameMajor, state });
      await student.save();
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi thêm học sinh mới." });
    }
  },
  editStudent: async (req, res) => {
    const { year, nameStudent, codeStudent, semester, nameMajor, state } = req.body;
    const { id } = req.params;
    const existingStudent = await Student.findOne({ _id: { $ne: id }, $or: [{ nameStudent }, { codeStudent }] });

    if (existingStudent) {
      return res.status(400).json({ message: "Học sinh đã tồn tại" });
    }
    try {
      const student = await Student.findByIdAndUpdate(
        id,
        { year, nameStudent, codeStudent, semester, nameMajor, state },
        { new: true }
      );
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
