const mongoose = require("mongoose");

const topicStudentSchema = new mongoose.Schema({
  codeStudent: {
    type: String,
    required: true,
    unique: true,
  },
  nameTopic: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
});

module.exports = mongoose.model("TopicStudent", topicStudentSchema);
