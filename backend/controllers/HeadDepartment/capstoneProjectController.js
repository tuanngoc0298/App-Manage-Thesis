const CapstoneProject = require("../../models/CapstoneProject");

const capstoneProjectController = {
  // GET
  getAllCapstoneProjects: async (req, res) => {
    const { searchQuery } = req.query;
    try {
      if (searchQuery) {
        const capstoneProjects = await CapstoneProject.find({
          $or: [
            { nameMajor: { $regex: searchQuery, $options: "i" } },
            { code: { $regex: searchQuery, $options: "i" } },
            { name: { $regex: searchQuery, $options: "i" } },
            { credit: { $regex: searchQuery, $options: "i" } },
          ],
        });
        res.json(capstoneProjects);
      } else {
        const capstoneProjects = await CapstoneProject.find();
        res.json(capstoneProjects);
      }
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách học phần KLTN." });
    }
  },
  // ADD
  addCapstoneProject: async (req, res) => {
    const { nameMajor, name, code, credit } = req.body;
    const existingCapstoneProject = await CapstoneProject.findOne({ $or: [{ name }, { code }] });

    if (existingCapstoneProject) {
      return res.status(400).json({ message: "Học phần KLTN đã tồn tại" });
    }
    try {
      const capstoneProject = new CapstoneProject({ nameMajor, name, code, credit });
      await capstoneProject.save();
      res.status(201).json(capstoneProject);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi thêm học phần KLTN mới." });
    }
  },
  // EDIT
  editCapstoneProject: async (req, res) => {
    const { nameMajor, name, code, credit } = req.body;
    const { id } = req.params;
    const existingCapstoneProject = await CapstoneProject.findOne({ _id: { $ne: id }, $or: [{ name }, { code }] });

    if (existingCapstoneProject) {
      return res.status(400).json({ message: "Học phần KLTN đã tồn tại" });
    }
    try {
      const capstoneProject = await CapstoneProject.findByIdAndUpdate(
        id,
        { nameMajor, name, code, credit },
        { new: true }
      );
      res.status(200).json(capstoneProject);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi sửa học phần KLTN." });
    }
  },
  // DELETE
  deleteCapstoneProject: async (req, res) => {
    const { id } = req.params;

    try {
      await CapstoneProject.findByIdAndRemove(id);
      res.json({ message: "Xóa học phần KLTN thành công!" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xóa học phần KLTN." });
    }
  },
};

module.exports = capstoneProjectController;
