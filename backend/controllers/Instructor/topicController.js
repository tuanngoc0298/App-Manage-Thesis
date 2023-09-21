const Topic = require("../../models/Topic");
const multer = require("multer");
const XLSX = require("xlsx");
const jwt = require("jsonwebtoken");

const topicController = {
  // GET
  getAllTopics: async (req, res) => {
    const { searchQuery } = req.query;
    try {
      if (searchQuery) {
        const topics = await Topic.find({
          $or: [
            { describe: { $regex: searchQuery, $options: "i" } },
            { nameMajor: { $regex: searchQuery, $options: "i" } },
            { name: { $regex: searchQuery, $options: "i" } },
            { nameTeacher: { $regex: searchQuery, $options: "i" } },
          ],
        });
        res.json(topics);
      } else {
        const topics = await Topic.find();
        res.json(topics);
      }
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách đề tài." });
    }
  },
  // IMPORT
  importTopics: async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    let data = XLSX.utils.sheet_to_json(worksheet);

    let newData;
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { name, major } = decoded.userInfo;

    newData = data.map((item) => {
      return { ...item, nameTeacher: name, nameMajor: major };
    });

    await Topic.deleteMany({ nameTeacher: name });

    // Lưu dữ liệu vào MongoDB
    await Topic.insertMany(newData)
      .then(() => {
        res.status(200).json({ message: "Data imported successfully" });
      })
      .catch((error) => {
        res.status(500).json({ message: "Error importing data", error });
      });
  },
  // Add
  addTopic: async (req, res) => {
    const { describe, name, nameMajor, nameTeacher } = req.body;
    const existingTopic = await Topic.findOne({ $or: [{ name }] });

    if (existingTopic) {
      return res.status(400).json({ message: "Đề tài đã tồn tại" });
    }
    try {
      const student = new Topic({ describe, name, nameMajor, nameTeacher });
      await student.save();
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi thêm đề tài mới." });
    }
  },
  editTopic: async (req, res) => {
    const { describe, name, nameMajor, nameTeacher } = req.body;
    const { id } = req.params;
    const existingTopic = await Topic.findOne({ _id: { $ne: id }, $or: [{ name }] });

    if (existingTopic) {
      return res.status(400).json({ message: "Đề tài đã tồn tại" });
    }
    try {
      const student = await Topic.findByIdAndUpdate(id, { describe, name, nameMajor, nameTeacher }, { new: true });
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi sửa đề tài." });
    }
  },
  deleteTopic: async (req, res) => {
    const { id } = req.params;

    try {
      await Topic.findByIdAndRemove(id);
      res.json({ message: "Xóa đề tài thành công!" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xóa đề tài." });
    }
  },
};

module.exports = topicController;
