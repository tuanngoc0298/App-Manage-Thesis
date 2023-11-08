const mongoose = require("mongoose");

const suggestTopicSchema = new mongoose.Schema({
  codeStudent: {
    type: String,
    required: true,
    unique: true,
  },
  nameTopic: {
    type: String,
    required: true,
    unique: true,
  },
  nameTeacher: {
    type: String,
  },
  describe: {
    type: String,
    required: true,
  },
  nameMajor: {
    type: String,
  },
  state: {
    type: String,
    required: true,
    enum: ["Đang chờ duyệt", "Phê duyệt", "Phân công"],
  },
});

module.exports = mongoose.model("SuggestTopic", suggestTopicSchema);
