const Pet = require('../models/Pet');
const PetType = require('../models/PetType');

// Generate a new petID and ensure it's unique
const generatePetID = async () => {
  let isUnique = false;
  let newPetId;

  while (!isUnique) {
    // Generate a new petID
    const lastPet = await Pet.findOne().sort({ PetID: -1 });

    if (lastPet && lastPet.PetID) {
      const lastPetId = parseInt(lastPet.PetID.slice(2)); 
      newPetId = `PT${("00000" + (lastPetId + 1)).slice(-5)}`;
    } else {
      newPetId = 'PT00001'; // Starting ID if there are no pets
    }

    // Check if the generated petID already exists
    const existingPet = await Pet.findOne({ PetID: newPetId });
    if (!existingPet) {
      isUnique = true;
    }
  }

  return newPetId;
};

// Create a pet
exports.createPet = async (req, res) => {
  try {
    const petID = await generatePetID(); 
    const { PetName, Gender, Status, AccountID, PetTypeID, Weight, Age } = req.body;

    const newPet = new Pet({
      PetID: petID, 
      PetName,
      Gender,
      Status,
      AccountID,
      PetTypeID,
      Weight,
      Age
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
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a pet by ID
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findOne({ PetID: req.params.id });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.status(200).json(pet);
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update pet (manager only)
exports.updatePet = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  delete updateData.PetID; 

  try {
    const pet = await Pet.findOneAndUpdate({ PetID: id }, updateData, { new: true }); // The { new: true } option returns the updated document

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json({ message: 'Pet updated successfully', pet });
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

// Get all pets by account_id
exports.getPetsByAccountId = async (req, res) => {
  try {
    const account_id = req.params.account_id; // accountId from request URL

    if (!account_id) {
      return res.status(400).json({ message: 'Account ID is missing' });
    }

    const pets = await Pet.find({ AccountID: account_id });
    res.status(200).json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
