const Topic = require("../../models/Topic");

const XLSX = require("xlsx");
const jwt = require("jsonwebtoken");

const topicController = {
  // GET
  getAllTopics: async (req, res) => {
    try {
      const { searchQuery, nameTeacher, year, semester } = req.query;
      const query = {};
      if (nameTeacher) {
        query.nameTeacher = nameTeacher;
      }
      if (year) {
        query.year = year;
      }
      if (semester) {
        query.semester = semester;
      }
      if (searchQuery) {
        query.$or = [
          { describeTopic: { $regex: searchQuery, $options: "i" } },
          { nameMajor: { $regex: searchQuery, $options: "i" } },
          { nameTopic: { $regex: searchQuery, $options: "i" } },
          { nameTeacher: { $regex: searchQuery, $options: "i" } },
        ];
      }
      const data = await Topic.find(query);
      res.json(data);
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

    let datas = XLSX.utils.sheet_to_json(worksheet);
    // Lọc dữ liệu có đủ 4 trường thông tin
    datas = datas.map((data) => {
      if (!data.nameTopic || !data.describeTopic || !data.nameMajor || !data.year || !data.semester) {
        return null;
      }

      const validData = {
        nameTopic: data.nameTopic,
        describeTopic: data.describeTopic,
        nameMajor: data.nameMajor,
        year: data.year,
        semester: data.semester,
      };
      return validData;
    });

    if (datas.includes(null)) return res.status(500).json({ message: "Error: Data thiếu dữ liệu" });

    let newData;
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
    const { name } = decoded.userInfo;

    newData = datas.map((item) => {
      return { ...item, nameTeacher: name };
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
    const { describeTopic, nameTopic, nameMajor, nameTeacher, year, semester } = req.body;
    const existingTopic = await Topic.findOne({ $or: [{ nameTopic }] });

    if (existingTopic) {
      return res.status(400).json({ message: "Đề tài đã tồn tại" });
    }
    try {
      const topic = new Topic({ describeTopic, nameTopic, nameMajor, nameTeacher, year, semester });
      await topic.save();
      res.status(201).json(topic);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi thêm đề tài mới." });
    }
  },
  editTopic: async (req, res) => {
    const { describeTopic, nameTopic, nameMajor, nameTeacher, year, semester } = req.body;
    const { id } = req.params;
    const existingTopic = await Topic.findOne({ _id: { $ne: id }, $or: [{ nameTopic }] });

    if (existingTopic) {
      return res.status(400).json({ message: "Đề tài đã tồn tại" });
    }
    try {
      const topic = await Topic.findByIdAndUpdate(
        id,
        { describeTopic, nameTopic, nameMajor, nameTeacher, year, semester },
        { new: true }
      );
      res.status(200).json(topic);
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
