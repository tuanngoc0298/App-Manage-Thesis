const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  describe: {
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
});

module.exports = mongoose.model("Topic", topicSchema);
