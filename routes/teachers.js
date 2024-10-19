const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Teacher = require("../models/Teacher");

// @route   POST api/teachers
// @desc    Create a new teacher
// @access  Private (Admin only)
router.post("/", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: "Not authorized" });
  }

  const { name, email, subjects, availability } = req.body;

  try {
    let teacher = new Teacher({
      name,
      email,
      subjects,
      availability,
    });

    await teacher.save();
    res.json(teacher);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/teachers
// @desc    Get all teachers
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
