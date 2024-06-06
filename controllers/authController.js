const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
let otps = {};

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
        return res.json({ message: 'Login successful', user: { id: account._id, email: account.email, role: account.role, fullname: account.fullname }, token });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      return res.status(401).json({ message: 'Cannot find account' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//generate accountID
const generateAccountID = async () => {
  const lastAccount = await Account.findOne({}, { account_id: 1 }).sort({ account_id: -1 }).exec();
  const lastId = lastAccount ? parseInt(lastAccount.account_id.substring(1)) : 0;
  return `A${lastId + 1}`;
};

// Register API
exports.register = async (req, res) => {
  const { fullname, email, password, phone, address } = req.body;
  try {
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({ message: 'Email đã tồn tại!' });
    }
    // Generate accountID
    const accountID = await generateAccountID();
    // encrypt password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = new Account({ 
      account_id: accountID,
      fullname: fullname, 
      email: email,
      password: hashedPassword, // save encrypted password
      phone: phone, 
      address: address,
      status: 1, 
      role: 'customer' 
    });
    await newAccount.save();

    res.json({ message: 'Registration successful', user: { accountID: newAccount.account_id, fullname: newAccount.fullname, email: newAccount.email, phone: newAccount.phone, address: newAccount.address } });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//change password api
exports.changePassword = async (req, res) => {
  const {  currentPassword, newPassword } = req.body; 
  const account_id = req.user.id; // get id from token stored in localStorage
  try {
    // Find account by _id
    const account = await Account.findById(account_id);
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

//ForgotPassword API
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).json({ message: 'Email không tồn tại!' });
    }
    
    const secret = JWT_SECRET + account.password;
    const token = jwt.sign({email: account.email, id: account.account_id}, secret, {
      expiresIn: "5m",
    })
    const resetLink = `http://localhost:5173/reset-password/${account.account_id}/${token}`;
    
    // Tạo nội dung email
    const mailOptions = {
      from: '"PetService" <kijtei2@gmail.com>',
      to: email,
      subject: "Reset Password",
      html: `<p>Chào bạn,</p>
             <p>Vui lòng nhấp vào <a href="${resetLink}">đây</a> để đặt lại mật khẩu của bạn.</p>
             <p>Liên kết sẽ hết hạn sau 5 phút.</p>`,
    };

    // Gửi email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: false,
      port: 587,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Lỗi khi gửi email' });
      }
      console.log('Email sent:', info.response);
      res.json({ message: 'Email gửi thành công' });
    });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

//ResetPassword API
exports.resetPassword = async (req, res) => {
  const { accountId, token } = req.params;
  const { newPassword } = req.body;

  try {
    // Fetch the user's account from the database
    const account = await Account.findOne({ account_id: accountId });
    if (!account) {
      return res.status(404).json({ message: 'Tài khoản không tồn tại!' });
    }

    // Verify the reset token
    const secret = JWT_SECRET + account.password;
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      account.password = hashedPassword;
      await account.save();

      // Respond with success message
      res.json({ message: 'Mật khẩu đã được đặt lại thành công!' });
    });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.logout = (req, res) => {
  // When logout, clear the token in the client side
  res.status(200).json({ message: 'Logout successful' });
};
