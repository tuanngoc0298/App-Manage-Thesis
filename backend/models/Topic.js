const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  nameTopic: {
    type: String,
    required: true,
    unique: true,
  },
  describeTopic: {
    type: String,
    required: true,
  },
  nameMajor: {
    type: String,
    required: true,
  },
  nameTeacher: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Topic", topicSchema);
