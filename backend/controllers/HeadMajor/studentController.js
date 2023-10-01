const Student = require("../../models/Student");

const XLSX = require("xlsx");
const jwt = require("jsonwebtoken");

const studentController = {
  // GET
  getAllStudents: async (req, res) => {
    try {
      const { searchQuery, nameMajor, year, semester } = req.query;
      const query = {};
      if (nameMajor) {
        query.nameMajor = nameMajor;
      }
      if (year) {
        query.year = year;
      }
      if (semester) {
        query.semester = semester;
      }
      if (searchQuery) {
        query.$or = [
          { code: { $regex: searchQuery, $options: "i" } },
          { name: { $regex: searchQuery, $options: "i" } },
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
      if (!data.name || !data.code || !data.year || !data.semester) {
        return null;
      }

      const validData = {
        name: data.name,
        code: data.code,
        year: data.year,
        semester: data.semester,
      };
      return validData;
    });

    if (datas.includes(null)) return res.status(500).json({ message: "Error: Data thiếu dữ liệu" });

    let newData;
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { nameMajor } = decoded.userInfo;

    newData = datas.map((item) => {
      return { ...item, nameMajor, state: "Đăng ký đề tài" };
    });
    await Student.deleteMany({ nameMajor });
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
    const { year, name, code, semester, nameMajor, state } = req.body;
    const existingStudent = await Student.findOne({ $or: [{ name }, { code }] });

    if (existingStudent) {
      return res.status(400).json({ message: "Học sinh đã tồn tại" });
    }
    try {
      const student = new Student({ year, name, code, semester, nameMajor, state });
      await student.save();
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi thêm học sinh mới." });
    }
  },
  editStudent: async (req, res) => {
    const { year, name, code, semester, nameMajor, state } = req.body;
    const { id } = req.params;
    const existingStudent = await Student.findOne({ _id: { $ne: id }, $or: [{ name }, { code }] });

    if (existingStudent) {
      return res.status(400).json({ message: "Học sinh đã tồn tại" });
    }
    try {
      const student = await Student.findByIdAndUpdate(
        id,
        { year, name, code, semester, nameMajor, state },
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
