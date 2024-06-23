const SpaService = require('../models/SpaService');
const cloudinary = require('../config/cloudinary');


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
    const { ServiceName, Description, PetTypeID, Price, Status } = req.body;
    let newService = new SpaService({
      ServiceID: serviceID,
      ServiceName: ServiceName,
      Description: Description,
      PetTypeID: PetTypeID,
      Price: Price,
      Status: Status,
    });

    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path); // Upload image to Cloudinary
      newService.ImageURL = result.secure_url; // Save the URL from Cloudinary
    }

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

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
    if (req.file && req.file.path) {
      const service = await SpaService.findOne({ ServiceID: id });

      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }

      if (service.ImageURL) {
        const publicId = service.ImageURL.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.ImageURL = result.secure_url;
    }

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
