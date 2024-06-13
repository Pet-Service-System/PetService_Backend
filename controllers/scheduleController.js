const Account = require('../models/Account');
const Schedule = require('../models/Schedule');

// Get all schedules api
exports.getSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get schedules by role api
exports.getScheduleByRole = async (req, res) => {
  try {
    const role = req.user.role; // Extract role from JWT token
    const schedules = await Schedule.find({ 'slots.employees': { $elemMatch: { role: role } } });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// assign employee to specific slots api
exports.assignEmployeeToSlots = async (req, res) => {
  try {
    const { day, slots, accountId , fullname, role} = req.body; 
    console.log(req.body);

    // Find the schedule for the specified day
    let schedule = await Schedule.findOne({ day: day });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Loop through the slots to update employee assignments
    for (const slot of slots) {
      const existingSlot = schedule.slots.find(s => s.start_time === slot.start_time && s.end_time === slot.end_time);
      if (!existingSlot) {
        return res.status(400).json({ message: `Slot with start time ${slot.start_time} and end time ${slot.end_time} not found in schedule` });
      }
      
      // Check if the employee is already assigned to this slot
      const employeeIndex = existingSlot.employees.findIndex(emp => emp.AccountID === accountId);
      if (employeeIndex !== -1) {
        return res.status(400).json({ message: `Employee with account ID ${accountId} is already assigned to this slot` });
      }

      const employee = {AccountID: accountId, fullname: fullname, role: role};
      // Assign the employee to the slot
      existingSlot.employees.push(employee); 
      console.log(existingSlot.employees);
    }

    // Save the updated schedule
    await schedule.save();

    res.status(200).json({ message: 'Employee assigned to slots successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove employee from specific slot api
exports.removeEmployeeFromSlot = async (req, res) => {
  try {
    const { day, start_time, end_time, accountId } = req.body;

    // Find the schedule for the specified day
    let schedule = await Schedule.findOne({ day: day });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Find the slot with the specified start and end time
    const existingSlot = schedule.slots.find(s => s.start_time === start_time && s.end_time === end_time);
    if (!existingSlot) {
      return res.status(400).json({ message: `Slot with start time ${start_time} and end time ${end_time} not found in schedule` });
    }

    // Find the employee in the slot
    const employeeIndex = existingSlot.employees.findIndex(emp => emp.AccountID === accountId);
    if (employeeIndex === -1) {
      return res.status(400).json({ message: `Employee with account ID ${accountId} is not assigned to this slot` });
    }

    // Remove the employee from the slot
    existingSlot.employees.splice(employeeIndex, 1);

    // Save the updated schedule
    await schedule.save();

    res.status(200).json({ message: 'Employee removed from slot successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


