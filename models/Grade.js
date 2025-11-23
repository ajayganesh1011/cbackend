const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  grade: { type: String, required: true }, // e.g., A, B+, 90 etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Grade", gradeSchema);
