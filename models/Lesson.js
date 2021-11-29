const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  subject: String,
  date: String,
  time: String,
  students: [String],
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;