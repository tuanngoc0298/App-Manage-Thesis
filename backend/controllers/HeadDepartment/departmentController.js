const Department = require("../../models/Department");

const departmentController = {
  // GET
  getAllDepartments: async (req, res) => {
    const { searchQuery } = req.query;
    try {
      if (searchQuery) {
        const departments = await Department.find({
          $or: [
            { codeDepartment: { $regex: searchQuery, $options: "i" } },
            { nameDepartment: { $regex: searchQuery, $options: "i" } },
            { describeDepartment: { $regex: searchQuery, $options: "i" } },
          ],
        });
        res.json(departments);
      } else {
        const departments = await Department.find();
        res.json(departments);
      }
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách khoa." });
    }
  },
  // ADD
  addDepartment: async (req, res) => {
    const { nameDepartment, codeDepartment, describeDepartment } = req.body;
    const existingDepartment = await Department.findOne({ $or: [{ nameDepartment }, { codeDepartment }] });

    if (existingDepartment) {
      return res.status(400).json({ error: "Khoa đã tồn tại" });
    }

    try {
      const department = new Department({ nameDepartment, codeDepartment, describeDepartment });
      await department.save();
      res.status(201).json(department);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi thêm khoa mới." });
    }
  },
  // EDIT
  editDepartment: async (req, res) => {
    const { nameDepartment, codeDepartment, describeDepartment } = req.body;
    const { id } = req.params;

    const existingDepartment = await Department.findOne({
      _id: { $ne: id },
      $or: [{ nameDepartment }, { codeDepartment }],
    });

    if (existingDepartment) {
      return res.status(400).json({ error: "Khoa đã tồn tại" });
    }

    try {
      const department = await Department.findByIdAndUpdate(
        id,
        { nameDepartment, codeDepartment, describeDepartment },
        { new: true }
      );
      res.status(200).json(department);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi sửa khoa." });
    }
  },
  // DELETE
  deleteDepartment: async (req, res) => {
    const { id } = req.params;

    try {
      await Department.findByIdAndRemove(id);
      res.json({ message: "Xóa khoa thành công!" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xóa khoa." });
    }
  },
};

module.exports = departmentController;
