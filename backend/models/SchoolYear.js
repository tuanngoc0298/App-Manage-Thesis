const mongoose = require("mongoose");

const schoolYearSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SchoolYear", schoolYearSchema);
