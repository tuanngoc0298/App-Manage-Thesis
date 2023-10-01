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
  nameTeacher: {
    type: String,
    required: true,
  },
  yearTopic: {
    type: String,
    required: true,
  },
  semesterTopic: {
    type: String,
    required: true,
  },
  completeLevel: {
    type: String,
  },
  comment: {
    type: String,
  },
  file: {
    nameFile: String,
    data: Buffer,
  },
  commentFinal: {
    type: String,
  },
  fileFinal: {
    nameFile: String,
    data: Buffer,
  },
  stateReportProgress: {
    type: String,
    enum: ["Đang chờ duyệt", "Phê duyệt", "Không phê duyệt"],
  },
  statePresentProject: {
    type: String,
    enum: ["Đang chờ duyệt", "Phê duyệt", "Không phê duyệt"],
  },
});

module.exports = mongoose.model("TopicStudent", topicStudentSchema);
