const SpaService = require('../models/SpaService');

// Generate a new serviceID
const generateServiceID = async () => {
  const lastService = await SpaService.findOne().sort({ ServiceID: -1 });

  if (lastService && lastService.ServiceID) {
      const lastServiceId = parseInt(lastService.ServiceID.slice(1)); 
      const newServiceId = `S${("000" + (lastServiceId + 1)).slice(-3)}`;
      return newServiceId;
  } else {
      return 'S001'; // Starting ID if there are no services
  }
};

// Create a service
exports.createService = async (req, res) => {
  try {
    const serviceID = await generateServiceID();
    const { ServiceName, Description, ImageURL, Price, Status } = req.body;
    const newService = new SpaService({
      ServiceID: serviceID,
      ServiceName: ServiceName,
      Description: Description,
      ImageURL: ImageURL,
      Price: Price,
      Status: Status,
    });
    await newService.save();
    res.status(201).json(newService); // Thêm status 201 để báo tạo thành công
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await SpaService.find();
    res.status(200).json(services); // Thêm status 200 để báo thành công
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await SpaService.findOne({ ServiceID: req.params.id });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service); // Thêm status 200 để báo thành công
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  delete updateData.serviceId; 
  try {
    const service = await SpaService.findOneAndUpdate(
      { ServiceID: id },
      updateData,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service updated successfully', service });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const service = await SpaService.findOneAndDelete({ ServiceID: req.params.id });
    if (!service) return res.status(404).json({ message: 'Service not found' });

    res.status(200).json({ message: 'Service deleted successfully' }); // Thêm status 200 để báo thành công
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
