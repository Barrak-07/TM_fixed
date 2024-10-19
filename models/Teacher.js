const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  subjects: [
    {
      type: String,
    },
  ],
  availability: {
    type: Map,
    of: Boolean,
  },
});

module.exports = mongoose.model("Teacher", TeacherSchema);
