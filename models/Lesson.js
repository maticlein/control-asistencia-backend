const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  subject: String,
  teacher: String,
  date: String,
  time: String,
  students: [Object],
}, {typeKey: '$type'});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;