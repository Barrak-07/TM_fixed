const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Timetable = require("../models/Timetable");
const Teacher = require("../models/Teacher");

// @route   POST api/timetables
// @desc    Create a new timetable and allocate teachers
// @access  Private (Admin only)
router.post("/", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: "Not authorized" });
  }

  const { class: classId, schedule } = req.body;

  try {
    // Allocate teachers to the timetable
    const allocatedSchedule = await allocateTeachers(schedule);

    let timetable = new Timetable({
      class: classId,
      schedule: allocatedSchedule,
    });

    await timetable.save();
    res.json(timetable);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Helper function to allocate teachers
async function allocateTeachers(schedule) {
  const allocatedSchedule = [];

  for (const slot of schedule) {
    const availableTeachers = await Teacher.find({
      subjects: slot.subject,
      [`availability.${slot.day}.${slot.time}`]: true,
    });

    if (availableTeachers.length > 0) {
      // Allocate the first available teacher
      const allocatedTeacher = availableTeachers[0];
      allocatedSchedule.push({
        ...slot,
        teacher: allocatedTeacher._id,
      });

      // Update teacher's availability
      allocatedTeacher.availability[slot.day][slot.time] = false;
      await allocatedTeacher.save();
    } else {
      // No available teacher found
      allocatedSchedule.push({
        ...slot,
        teacher: null,
      });
    }
  }

  return allocatedSchedule;
}

// @route   GET api/timetables
// @desc    Get all timetables
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate("class", ["name", "subject"])
      .populate("schedule.teacher", ["name", "email"]);
    res.json(timetables);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
