const Account = require('../models/Account');


// Get all accounts API (admin)
exports.getAllAccounts = async (req, res) => {
    try {
      const accounts = await Account.find();
      res.json({ accounts });
    } catch (error) {
      console.error('Error getting all accounts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Get Account by ID 
  exports.getAccountById = async (req, res) => {
    const accountId = req.params.id;
  
    try {
      const account = await Account.findOne({AccountID: accountId});
  
      if (!account) {
        return res.status(404).json({ message: 'Account not found!' });
      }
  
      res.json({ user: account });
    } catch (error) {
      console.error('Error getting account information by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Get Account by Role (admin)
exports.getAccountByRole = async (req, res) => {
  const role = req.params.role;

  try {
    let accounts;

    if (role) {
      accounts = await Account.find({ role: role });
    } else {
      accounts = await Account.find({ role: { $in: ['Sales Staff', 'Caretaker Staff'] } });
    }

    if (accounts.length === 0) {
      return res.status(404).json({ message: 'No accounts found for the specified role!' });
    }

    res.json({ accounts });
  } catch (error) {
    console.error('Error getting accounts by role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




  // Update an account by ID 
exports.updateAccountById = async (req, res) => {
    const accountId = req.params.id;
    const updates = req.body;
  
    try {
      const account = await Account.findOne({AccountID: accountId});
  
      if (!account) {
        return res.status(404).json({ message: 'Account not found!' });
      }

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
    const accountId = req.user.id;
  
    try {
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
  
  // Get fullname and role of an account by ID
exports.getFullnameById = async (req, res) => {
  const accountId = req.params.id;

  try {
      const account = await Account.findOne({ AccountID: accountId }, 'fullname');

      if (!account) {
          return res.status(404).json({ message: 'Account not found!' });
      }

      res.json({ fullname: account.fullname, role: account.role });
  } catch (error) {
      console.error('Error getting fullname and role of account by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
