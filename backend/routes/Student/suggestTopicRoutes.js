const express = require("express");
const router = express.Router();

const suggestTopicController = require("../../controllers/Student/suggestTopicController");

router.get("/suggestTopic", suggestTopicController.getSuggestTopic);

// Định nghĩa route để thêm giáo viên mới
router.post("/suggestTopic", suggestTopicController.addSuggestTopic);

// Định nghĩa route sửa giáo viên
router.put("/suggestTopic/:id", suggestTopicController.editSuggestTopic);

// Định nghĩa route xóa giáo viên
router.delete("/suggestTopic/:id", suggestTopicController.deleteSuggestTopic);
module.exports = router;
