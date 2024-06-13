const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  employees: [
    {
      AccountID: { type: String, required: true },
      fullname: { type: String, required: true },
      role: { type: String, required: true },
    }
  ]
}, { versionKey: false });

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  slots: [slotSchema]
});

const Schedule = mongoose.model('Schedule', scheduleSchema, 'Schedules');

module.exports = Schedule;
