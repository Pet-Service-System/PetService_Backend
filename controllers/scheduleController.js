const Schedule = require('../models/Schedule');
const { format, parseISO } = require('date-fns'); 
const {getAccountById} = require('../controllers/accountController');

// get schedule api
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
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
  const listId = req.body.id; 
  const listNamePromises = listId.map(id => getAccountById(id));

  try {
    const accounts = await Promise.all(listNamePromises);
    const listName = accounts.map(account => account.fullname);

    const { title, weekStart, weekEnd, role, timeSlots } = req.body;

    // Ensure timeSlots contain arrays of employeeIds and employeeNames
    const formattedTimeSlots = timeSlots.map(slot => ({
      ...slot,
      employeeIds: slot.employeeIds || [],
      employeeNames: slot.employeeNames || []
    }));

    const schedule = new Schedule({
      title,
      weekStart: parseISO(weekStart), // Ensure dates are parsed correctly
      weekEnd: parseISO(weekEnd),
      role,
      timeSlots: formattedTimeSlots
    });

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