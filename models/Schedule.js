const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  title: String,
  weekStart: Date,
  weekEnd: Date,
  employeeId : { type: String, required: true, ref: 'Account' },
  timeSlots: [{ start: String, end: String }]
}, { versionKey: false });

const Schedule = mongoose.model('Schedule', scheduleSchema, 'Schedules');

module.exports = Schedule;
