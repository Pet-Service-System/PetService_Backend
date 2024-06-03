const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const SALT_ROUNDS = 10;

// Login api to authenticate the user and provide a JWT token
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await Account.findOne({ email });
    if (account) {
      const isMatch = await bcrypt.compare(password, account.password);
      if (isMatch) {
        // Create JWT token with unique payload
        const token = jwt.sign(
          { id: account._id, email: account.email, role: account.role },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );
        return res.json({ message: 'Login successful', user: { id: account._id, email: account.email, role: account.role }, token });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Forgot password api
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

//change password api
exports.changePassword = async (req, res) => {
  const { id, currentPassword, newPassword } = req.body; // get id from token stored in localStorage
  try {
    console.log('Request Body:', req.body);

    // Find account by _id
    const account = await Account.findById(id);
    if (!account) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare current password with the hashed password in the database
    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) {
      console.log('Incorrect current password');
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Hash the new password before saving it
    account.password = await bcrypt.hash(newPassword, 10);
    await account.save();

    console.log('Password changed successfully');
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//logout api
exports.logout = (req, res) => {
  // When logout, clear the token in the client side
  res.status(200).json({ message: 'Logout successful' });
};
