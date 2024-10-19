const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  schedule: [
    {
      day: String,
      time: String,
      subject: String,
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    },
  ],
});

module.exports = mongoose.model("Timetable", TimetableSchema);
