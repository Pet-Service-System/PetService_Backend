const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  title: String,
  weekStart: Date,
  weekEnd: Date,
  employeeName: String,
  timeSlots: [{ start: String, end: String }]
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
