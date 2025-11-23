const express = require("express");
const asyncHandler = require("express-async-handler");
const Course = require("../models/Course");
const Grade = require("../models/Grade");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Get available courses (public)
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
  })
);

// Student: get own profile
router.get(
  "/me",
  protect,
  authorize("student", "admin"),
  asyncHandler(async (req, res) => {
    res.json(req.user);
  })
);

// Student: get own grades
router.get(
  "/grades",
  protect,
  authorize("student"),
  asyncHandler(async (req, res) => {
    const grades = await Grade.find({ student: req.user._id }).populate("course", "title code");
    res.json(grades);
  })
);

module.exports = router;
