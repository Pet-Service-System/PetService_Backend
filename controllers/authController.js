const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';



// Register API
exports.register = async (req, res) => {
  const { fullname, email, password, phonenumber, address } = req.body;
  try {
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newAccount = new Account({ fullname, email, password, phonenumber, address });
    await newAccount.save();

    res.json({ message: 'Registration successful', user: { fullname: newAccount.fullname, email: newAccount.email, phonenumber: newAccount.phonenumber, address: newAccount.address } });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await Account.findOne({ email, password });
    if (account) {
      // Create JWT token with unique payload
      const token = jwt.sign(
        { id: account._id, email: account.email, role: account.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      res.json({ message: 'Login successful', user: { email: account.email, role: account.role }, token, redirectPage });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.forgetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    account.password = newPassword;
    await account.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Assuming you have user id in the token

  try {
      const account = await Account.findById(userId);

      if (!account) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Directly compare the current password
      if (currentPassword !== account.password) {
          return res.status(400).json({ message: 'Incorrect current password' });
      }

      // Assign the new password directly
      account.password = newPassword;

      await account.save();

      res.json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};