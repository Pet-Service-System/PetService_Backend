const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeSlotSchema = new Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  employeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }],
  employeeNames: [{ type: String, required: true }]
});

const scheduleSchema = new Schema({
  title: { type: String, required: true },
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true },
  role: { type: String, required: true },
  timeSlots: [timeSlotSchema]
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
