const Pet = require('../models/Pet');
const PetType = require('../models/PetType');

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
    const { petName, gender, status, accountId, petTypeId } = req.body;

    // Check if petTypeId exists in PetTypes collection
    const petType = await PetType.findById(petTypeId);
    if (!petType) {
      return res.status(400).json({ message: 'Invalid pet type ID' });
    }

    const newPet = new Pet({
      PetID: petID, 
      PetName: petName,
      Gender: gender,
      Status: status,
      AccountID: accountId,
      PetTypeID: petTypeId,
    });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all pets
exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate('PetTypeID', 'TypeName Description');
    res.status(200).json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a pet by ID
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findOne({ PetID: req.params.id }).populate('PetTypeID', 'TypeName Description');
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.status(200).json(pet);
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a pet
exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findOne({ PetID: req.params.id });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    const { petName, gender, status, accountId, petTypeId } = req.body;

    // Check if petTypeId exists in PetTypes collection if it's being updated
    if (petTypeId && petTypeId !== pet.PetTypeID) {
      const petType = await PetType.findById(petTypeId);
      if (!petType) {
        return res.status(400).json({ message: 'Invalid pet type ID' });
      }
    }

    pet.PetName = petName || pet.PetName;
    pet.Gender = gender || pet.Gender;
    pet.Status = status || pet.Status;
    pet.AccountID = accountId || pet.AccountID;
    pet.PetTypeID = petTypeId || pet.PetTypeID;

    await pet.save();
    res.status(200).json({ message: 'Pet updated successfully', pet });
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Delete a pet
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ PetID: req.params.id });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};