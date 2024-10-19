const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Class = require("../models/Class");

// @route   POST api/classes
// @desc    Create a new class
// @access  Private (Admin only)
router.post("/", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: "Not authorized" });
  }

  const { name, subject, teacher, students } = req.body;

  try {
    let newClass = new Class({
      name,
      subject,
      teacher,
      students,
    });

    await newClass.save();
    res.json(newClass);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/classes
// @desc    Get all classes
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const classes = await Class.find().populate("teacher", ["name", "email"]);
    res.json(classes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
