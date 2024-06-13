const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Account = require('../models/Account');
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
          { id: account.AccountID, email: account.email, fullname: account.fullname, role: account.role },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );
        return res.json({ message: 'Login successful', user: { id: account.AccountID, email: account.email, role: account.role, fullname: account.fullname,  phone: account.phone, 
          address: account.address }, token });
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

const generateAccountID = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Tìm kiếm tài khoản cuối cùng dựa trên AccountID
    const lastAccount = await Account.findOne({}, { AccountID: 1 }).sort({ AccountID: -1 }).session(session).exec();
    let lastId = 0;

    if (lastAccount && lastAccount.AccountID) {
      const idPart = lastAccount.AccountID.substring(1);
      if (/^\d+$/.test(idPart)) {
        lastId = parseInt(idPart);
      } else {
        console.error(`Invalid AccountID format found: ${lastAccount.AccountID}`);
        throw new Error('Invalid last account ID format');
      }
    }

    const newId = lastId + 1;
    const newAccountId = `A${newId.toString().padStart(3, '0')}`;

    await session.commitTransaction();
    return newAccountId;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


    // Setup email transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: false,
      port: 587,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });

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
      AccountID: accountID,
      fullname: fullname, 
      email: email,
      password: hashedPassword, // save encrypted password
      phone: phone, 
      address: address,
      status: 1, 
      role: 'Customer' 
    });
    await newAccount.save();

    res.json({ message: 'Registration successful', user: { accountID: newAccount.AccountID, fullname: newAccount.fullname, email: newAccount.email, phone: newAccount.phone, address: newAccount.address } });
       // Tạo nội dung email
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
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Error sending email' });
        }
        console.log('Email sent:', info.response);
        res.json({ message: 'Email sent successfully' });
      });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//change password api
exports.changePassword = async (req, res) => {
const {  currentPassword, newPassword } = req.body; 
  const AccountID = req.user.id; // get id from token stored in localStorage
  try {
    // Find account by _id
    const account = await Account.findOne({AccountID: AccountID});
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
      return res.status(404).json({ message: 'Email doesnt exist' });
    }
    
    const secret = JWT_SECRET + account.password;
    const token = jwt.sign({email: account.email, id: account.AccountID}, secret, {
      expiresIn: "5m",
    })
    const resetLink = `http://localhost:5173/reset-password/${account.AccountID}/${token}`;
    
    // Tạo nội dung email
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
        return res.status(500).json({ message: 'Errors when sending emails' });
      }
      console.log('Email sent:', info.response);
      res.json({ message: 'Email sent successfully' });
    });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//ResetPassword API
exports.resetPassword = async (req, res) => {
  const { accountId, token } = req.params;
  const { newPassword } = req.body;

  try {
    // Fetch the user's account from the database
    const account = await Account.findOne({ AccountID: accountId });
    if (!account) {
      return res.status(404).json({ message: 'Account doesnt exist!' });
    }

    // Verify the reset token
    const secret = JWT_SECRET + account.password;
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: 'Invalid or expired tokens!' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      account.password = hashedPassword;
      await account.save();

      // Respond with success message
      res.json({ message: 'The password has been reset successfully!' });
    });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.logout = (req, res) => {
  // When logout, clear the token in the client side
  res.status(200).json({ message: 'Logout successful' });
};
