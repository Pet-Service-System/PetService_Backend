const Pet = require('../models/Pet');

// Generate a new petID
const generatePetID = async () => {
  const lastPet = await Pet.findOne().sort({ PetID: -1 });

  if (lastPet && lastPet.PetID) {
      const lastPetId = parseInt(lastPet.PetID.slice(2)); 
      const newPetId = `PT${("00000" + (lastPetId + 1)).slice(-5)}`;
      return newPetId;
  } else {
      return 'PT00001'; // Starting ID if there are no pets
  }
};

// Create a pet
exports.createPet = async (req, res) => {
  try {
    const petID = await generatePetID(); 
    const { petName, gender, image, petWeight, status } = req.body;
    const newPet = new Pet({
      PetID: petID, 
      PetName: petName,
      Gender: gender,
      Image: image,
      PetWeight: petWeight,
      Status: status,
    });
    await newPet.save();
    res.status(201).json(newPet); // Thêm status 201 để báo tạo thành công
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all pets
exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets); // Thêm status 200 để báo thành công
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a pet by ID
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findOne({ PetID: req.params.id }); // Chỉnh sửa để sử dụng PetID thay vì petID
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.status(200).json(pet); // Thêm status 200 để báo thành công
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a pet
exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findOne({ PetID: req.params.id }); // Chỉnh sửa để sử dụng PetID thay vì petID
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    const { petName, gender, image, petWeight, status } = req.body;
    pet.PetName = petName || pet.PetName;
    pet.Gender = gender || pet.Gender;
    pet.Image = image || pet.Image;
    pet.PetWeight = petWeight || pet.PetWeight;
    pet.Status = status || pet.Status;

    await pet.save();
    res.status(200).json({ message: 'Pet updated successfully', pet }); // Thêm status 200 để báo thành công
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a pet
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ PetID: req.params.id }); // Chỉnh sửa để sử dụng findOneAndDelete thay vì tìm và sau đó xóa
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    res.status(200).json({ message: 'Pet deleted successfully' }); // Thêm status 200 để báo thành công
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
