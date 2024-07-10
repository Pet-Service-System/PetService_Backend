const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const nodemailer = require('nodemailer');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Import idGenerators from utils
const { generateAccountID } = require('../utils/idGenerators');

// Login api to authenticate the user and provide a JWT token
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await Account.findOne({ email }); // Login API to check if the email exists
    if (account) {
      const isMatch = await bcrypt.compare(password, account.password); // Check if the password is matched
      if (isMatch) {
        // Create JWT token with unique payload
        const token = jwt.sign(
          { id: account.AccountID, email: account.email, fullname: account.fullname, role: account.role },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );
        return res.json({ message: 'Login successful', user: { id: account.AccountID, email: account.email, role: account.role, fullname: account.fullname,  phone: account.phone, 
          address: account.address }, token });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' }); // Invalid password
      }
    } else {
      return res.status(401).json({ message: 'Cannot find account' }); // Cannot find account
    }
  } catch (error) {
    console.error('Error during login:', error); // Error during login
    return res.status(500).json({ message: 'Internal server error' }); // Internal server error
  }
};

// Register API
exports.register = async (req, res) => {
  const { fullname, email, password, phone, address } = req.body; // Get fullname, email, password, phone, and address from request body
  try {
    const existingAccount = await Account.findOne({ email }); // Check if the email exists
    if (existingAccount) {
      return res.status(400).json({ message: 'Email already in use' }); // Email already exists
    }
    // Generate accountID using idGenerators
    const accountID = await generateAccountID(); // Generate unique accountID
    // encrypt password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const newAccount = new Account({ 
      AccountID: accountID,
      fullname: fullname, 
      email: email,
      password: hashedPassword, // save encrypted password
      phone: phone, 
      address: address,
      status: 1, 
      role: 'Customer' 
    });
    await newAccount.save(); // Save new account

    res.json({ message: 'Registration successful', user: { accountID: newAccount.AccountID, fullname: newAccount.fullname, email: newAccount.email, phone: newAccount.phone, address: newAccount.address } }); // Registration successful

    // Tạo nội dung email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: false,
      port: 587,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"PetService" <petservicesswp391@gmail.com>',
      to: email,
      subject: "Chào mừng đến với PetService!",
      html: `<p>Chào bạn ${fullname},</p>
             <p>Cảm ơn bạn đã đăng ký tài khoản tại PetService. Chúng tôi rất vui mừng chào đón bạn đến với cộng đồng yêu thú cưng của chúng tôi.</p>
             <p>Hãy truy cập vào tài khoản của bạn để khám phá nhiều dịch vụ và thông tin hữu ích dành cho thú cưng của bạn.</p>
             <p>Chúc bạn có những trải nghiệm tuyệt vời tại PetService!</p>
             <p>Thân ái,</p>
             <p>Đội ngũ PetService</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error); // Error sending email
        return res.status(500).json({ message: 'Error sending email' }); // Error sending email
      }
      res.json({ message: 'Email sent successfully' }); // Email sent successfully
    });
  } catch (error) {
    console.error('Error during registration:', error); // Error during registration
    res.status(500).json({ message: 'Internal server error' }); // Internal server error
  }
};

// Change password api
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body; // Get currentPassword and newPassword from request body
  const AccountID = req.user.id; // get id from token stored in localStorage
  try {
    // Find account by _id
    const account = await Account.findOne({ AccountID: AccountID }); // Find account by AccountID
    if (!account) {
      return res.status(404).json({ message: 'User not found' }); // User not found
    }

    // Compare current password with the hashed password in the database
    const isMatch = await bcrypt.compare(currentPassword, account.password); // Compare passwords
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' }); // Incorrect current password
    }

    // Hash the new password before saving it
    account.password = await bcrypt.hash(newPassword, 10); // Hash new password
    await account.save(); // Save new password

    res.json({ message: 'Password changed successfully' }); // Password changed successfully
  } catch (error) {
    console.error('Error changing password:', error); // Error changing password
    res.status(500).json({ message: 'Internal server error' }); // Internal server error
  }
};

// ForgotPassword API
exports.forgotPassword = async (req, res) => {
  const { email } = req.body; // Get email from request body
  try {
    const account = await Account.findOne({ email }); // Find account by email
    if (!account) {
      return res.status(404).json({ message: 'Email doesnt exist' }); // Email does not exist
    }
    
    const secret = JWT_SECRET + account.password; // Create secret for JWT token
    const token = jwt.sign({ email: account.email, id: account.AccountID }, secret, {
      expiresIn: "5m",
    });
    const resetLink = `http://localhost:5173/reset-password/${account.AccountID}/${token}`; // Generate reset password link
    
    // Tạo nội dung email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: false,
      port: 587,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"PetService" <${EMAIL_USERNAME}>`,
      to: email,
      subject: "🔒 Yêu Cầu Đặt Lại Mật Khẩu",
      html: `<p>Chào Bạn Yêu Thú Cưng,</p>
             <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn.</p>
             <p>Vui lòng nhấp vào <a href="${resetLink}">đây</a> để đặt lại mật khẩu của bạn. Lưu ý rằng liên kết này sẽ hết hạn sau 5 phút vì lý do bảo mật.</p>
             <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
             <p>Trân trọng,<br>Đội Ngũ PetService</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error); // Error sending email
        return res.status(500).json({ message: 'Errors when sending emails' }); // Errors when sending emails
      }
      res.json({ message: 'Email sent successfully' }); // Email sent successfully
    });
  } catch (error) {
    console.error('Error during password reset:', error); // Error during password reset
    res.status(500).json({ message: 'Internal Server Error' }); // Internal Server Error
  }
};

// ResetPassword API
exports.resetPassword = async (req, res) => {
  const { accountId, token } = req.params; // Get accountId and token from request parameters
  const { newPassword } = req.body; // Get newPassword from request body

  try {
    // Fetch the user's account from the database
    const account = await Account.findOne({ AccountID: accountId }); // Find account by accountId
    if (!account) {
      return res.status(404).json({ message: 'Account doesnt exist!' }); // Account does not exist
    }

    // Verify the reset token
    const secret = JWT_SECRET + account.password; // Create secret for JWT token
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: 'Invalid or expired tokens!' }); // Invalid or expired token
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash new password

      // Update the user's password in the database
      account.password = hashedPassword; // Update password
      await account.save(); // Save new password

      // Respond with success message
      res.json({ message: 'The password has been reset successfully!' }); // Password reset successful
    });
  } catch (error) {
    console.error('Error during password reset:', error); // Error during password reset
    res.status(500).json({ message: 'Internal Server Error' }); // Internal Server Error
  }
};

exports.logout = (req, res) => {
  // When logout, clear the token in the client side
  res.status(200).json({ message: 'Logout successful' }); // Logout successful
};

exports.googleAuth = async (req, res) => {
  const { token: googleToken } = req.body; // Get googleToken from request body

  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { name, email } = payload; // Get name and email from Google token payload

    let account = await Account.findOne({ email });

    if (!account) {
      account = new Account({
        AccountID: await generateAccountID(), // Generate unique AccountID
        fullname: name,
        password: '', // No password for Google accounts
        address: '',
        email,
        phone: '',
        status: 1,
        role: 'Customer',
      });
      await account.save(); // Save new Google account
    }

    const jwtToken = jwt.sign(
      { id: account.AccountID, email: account.email, fullname: account.fullname, role: account.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return res.json({ message: 'Login successful', user: { id: account.AccountID, email: account.email, role: account.role, fullname: account.fullname, phone: account.phone, address: account.address },
      token: jwtToken
    });
  } catch (error) {
    console.error(error); // Error during authentication
    res.status(400).json({ message: 'Error during authentication', error });
  }
};

// Check if email exists
exports.checkEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const account = await Account.findOne({ email });
    if (account) {
      return res.status(200).json({ exists: true, message: 'Email already in use' });
    }
    return res.status(200).json({ exists: false, message: 'Email is available' });
  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};