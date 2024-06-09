const Schedule = require('../models/Schedule');
const { format, parseISO } = require('date-fns'); 

// get schedule api
exports.getSchedules = async (req, res) => {
  const { account_id, fullname } = req.body;
  try {
    const schedules = await Schedule.find({ employeeId: account_id });
    const formattedSchedules = schedules.map(schedule => ({
      ...schedule.toObject(),
      weekStart: format(schedule.weekStart, 'yyyy-MM-dd'),
      weekEnd: format(schedule.weekEnd, 'yyyy-MM-dd')
    }));
    res.send(formattedSchedules);
  } catch (error) {
    console.error('Error fetching schedules:', error); // Log the detailed error
    res.status(500).json({ message: 'Error fetching schedules', error: error.message });
  }
};

// create schedule api
exports.createSchedule = async (req, res) => {
  const { title, weekStart, weekEnd, timeSlots } = req.body;
  const schedule = new Schedule({
    title,
    weekStart: parseISO(weekStart), // Ensure dates are parsed correctly
    weekEnd: parseISO(weekEnd),
    timeSlots,
    employeeId: req.user.id,
    employeeName: req.user.name
  });
  try {
    await schedule.save();
    res.send({
      ...schedule.toObject(),
      weekStart: format(schedule.weekStart, 'yyyy-MM-dd'),
      weekEnd: format(schedule.weekEnd, 'yyyy-MM-dd')
    });
  } catch (error) {
    console.error('Error creating schedule:', error); // Log the detailed error
    res.status(500).json({ message: 'Error creating schedule', error: error.message });
  }
};