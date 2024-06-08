const Account = require('../models/Account');

// Get all accounts (admin)
exports.getAllAccounts = async (req, res) => {
    try {
      const accounts = await Account.find();
      res.json({ accounts });
    } catch (error) {
      console.error('Error getting all accounts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


// Get Account API
exports.getAccount = async (req, res) => {
    const accountId = req.user.id; // Assuming the user's account ID is stored in the request
  
    try {
      // Find the account by ID
      const account = await Account.findById(accountId);
  
      if (!account) {
        return res.status(404).json({ message: 'Account not found!' });
      }
  
      res.json({ user: account });
    } catch (error) {
      console.error('Error getting account information:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Get Account by ID (admin)
  exports.getAccountById = async (req, res) => {
    const accountId = req.params.id; // Assuming the account ID is provided in the request params
  
    try {
      // Find the account by ID
      const account = await Account.findById(accountId);
  
      if (!account) {
        return res.status(404).json({ message: 'Account not found!' });
      }
  
      res.json({ user: account });
    } catch (error) {
      console.error('Error getting account information by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Update Account API 
exports.updateAccount = async (req, res) => {
    const accountId = req.user.id; // user's account ID is stored in the request
    const updates = req.body; 
  
    try {
      // Find the account by ID
      const account = await Account.findById(accountId);
  
      if (!account) {
        return res.status(404).json({ message: 'Invalid Account' });
      }
  
      // Apply updates to the account object
      Object.keys(updates).forEach((key) => {
        account[key] = updates[key];
      });
  
      // Save the updated account
      await account.save();
  
      res.json({ message: 'Update account successfully', user: account });
    } catch (error) {
      console.error('Error while updating account', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // Update an account by ID (admin)
exports.updateAccountById = async (req, res) => {
    const accountId = req.params.id;
    const updates = req.body;
  
    try {
      const account = await Account.findById(accountId);
  
      if (!account) {
        return res.status(404).json({ message: 'Account not found!' });
      }
  
      // Update account properties
      Object.assign(account, updates);
  
      await account.save();
  
      res.json({ message: 'Account updated successfully', account });
    } catch (error) {
      console.error('Error updating account:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
  // Delete Account API (admin)
  exports.deleteAccount = async (req, res) => {
    const accountId = req.user.id; // Assuming the user's account ID is stored in the request
  
    try {
      // Find the account by ID and delete it
      const deletedAccount = await Account.findByIdAndDelete(accountId);
  
      if (!deletedAccount) {
        return res.status(404).json({ message: 'Account not found!' });
      }
  
      res.json({ message: 'Account deleted successfully', deletedUser: deletedAccount });
    } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  