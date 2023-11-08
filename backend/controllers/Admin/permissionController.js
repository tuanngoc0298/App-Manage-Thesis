const Permission = require("../../models/Permission");

const permissionController = {
  // GET
  getAllPermissions: async (req, res) => {
    const { searchQuery } = req.query;
    try {
      if (searchQuery) {
        const permissions = await Permission.find({
          $or: [
            { codePermission: { $regex: searchQuery, $options: "i" } },
            { namePermission: { $regex: searchQuery, $options: "i" } },
            { describePermission: { $regex: searchQuery, $options: "i" } },
          ],
        });
        res.json(permissions);
      } else {
        const permissions = await Permission.find();
        res.json(permissions);
      }
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải danh sách nhóm quyền." });
    }
  },
  // ADD
  addPermission: async (req, res) => {
    const { namePermission, codePermission, describePermission } = req.body;
    const existingPermission = await Permission.findOne({ $or: [{ namePermission }, { codePermission }] });

    if (existingPermission) {
      return res.status(400).json({ error: "Nhóm quyền đã tồn tại" });
    }

    try {
      const permission = new Permission({ namePermission, codePermission, describePermission });
      await permission.save();
      res.status(201).json(permission);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi thêm nhóm quyền mới." });
    }
  },
  // EDIT
  editPermission: async (req, res) => {
    const { namePermission, codePermission, describePermission } = req.body;
    const { id } = req.params;

    const existingPermission = await Permission.findOne({
      _id: { $ne: id },
      $or: [{ namePermission }, { codePermission }],
    });

    if (existingPermission) {
      return res.status(400).json({ error: "Nhóm quyền đã tồn tại" });
    }

    try {
      const permission = await Permission.findByIdAndUpdate(
        id,
        { namePermission, codePermission, describePermission },
        { new: true }
      );
      res.status(200).json(permission);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi sửa nhóm quyền." });
    }
  },
  // DELETE
  deletePermission: async (req, res) => {
    const { id } = req.params;

    try {
      await Permission.findByIdAndRemove(id);
      res.json({ message: "Xóa khoa thành công!" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xóa nhóm quyền." });
    }
  },
};

module.exports = permissionController;
