const express = require("express");
const asyncHandler = require("express-async-handler");
const Course = require("../models/Course");
const User = require("../models/User");
const Grade = require("../models/Grade");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Create course
router.post(
  "/courses",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { title, code, description, credits } = req.body;
    const course = await Course.create({ title, code, description, credits });
    res.status(201).json(course);
  })
);

// Get all courses
router.get(
  "/courses",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  })
);

// Update course
router.put(
  "/courses/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }
    res.json(course);
  })
);

// Delete course
router.delete(
  "/courses/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }
    res.json({ message: "Course deleted" });
  })
);

// Manage users: list all users
router.get(
  "/users",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  })
);

// Assign role to user
router.put(
  "/users/:id/role",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    user.role = role;
    await user.save();
    res.json({ message: "Role updated", user: { id: user._id, role: user.role } });
  })
);

// Grades management (create / assign grade)
router.post(
  "/grades",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { studentId, courseId, grade } = req.body;
    const g = await Grade.create({ student: studentId, course: courseId, grade });
    res.status(201).json(g);
  })
);

// Admin stats
router.get(
  "/stats",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const usersCount = await User.countDocuments();
    const coursesCount = await Course.countDocuments();
    const gradesCount = await Grade.countDocuments();
    res.json({ usersCount, coursesCount, gradesCount });
  })
);

module.exports = router;
