const Account = require('../models/Account');
const nodemailer = require('nodemailer');
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const Voucher = require('../models/Voucher');
const { generateVoucherID, generateVoucherPattern } = require('../utils/idGenerators');
const SpaBooking = require('../models/SpaBooking');

  // Get all accounts API (admin)
  exports.getAllAccounts = async (req, res) => {
    try {
      const accounts = await Account.find().select('-password'); // Exclude password field
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

exports.getMembershipById = async (req, res) => {
  const accountId = req.params.id;

  try {
    const account = await Account.findOne({ AccountID: accountId });

    if (!account) {
      return res.status(404).json({ message: 'Account not found!' });
    }

    res.json({
      totalSpent: account.totalSpent,
      membershipType: account.membershipType,
      startDate: account.startDate,
      endDate: account.endDate,
    });
  } catch (error) {
    console.error('Error getting membership details of account by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update membership details of an account by ID

exports.updateCurrentSpent = async (req, res) => {
  let booleanUpgrade = false;
  const accountId = req.params.id;
  let memberStatus = 0;

  try {
    const account = await Account.findOne({ AccountID: accountId });
    const bookings = await SpaBooking.find({ AccountID: accountId, isSpentUpdated: false });
    if (!account) {
      return res.status(404).json({ message: 'Account not found!' });
    }

    let updatedTotalSpent = 0;

    for (const booking of bookings) {
      updatedTotalSpent += booking.TotalPrice;
      booking.isSpentUpdated = true;
      await booking.save();
    }

    account.totalSpent += updatedTotalSpent;
    await account.save();

    if (account.totalSpent >= 3000000 && account.membershipType !== 'VIP') {
      account.membershipType = 'VIP';
      account.startDate = new Date();
      account.endDate = new Date(account.startDate);
      account.endDate.setMonth(account.endDate.getMonth() + 1);
      booleanUpgrade = true;
      memberStatus = 2;
    } else if (account.totalSpent >= 1500000 && account.membershipType !== 'Premium') {
      account.membershipType = 'Premium';
      account.startDate = new Date();
      account.endDate = new Date(account.startDate);
      account.endDate.setMonth(account.endDate.getMonth() + 1);
      booleanUpgrade = true;
      memberStatus = 1;
    }

    await account.save();

    if (booleanUpgrade) {
      let discountValue = 0;
      if (memberStatus == 1) {
        discountValue = 500000;
      } else if (memberStatus == 2) {
        discountValue = 1000000;
      }

      const voucherID = await generateVoucherID();
      const voucherPattern = await generateVoucherPattern();
      const voucher = new Voucher({
        VoucherID: voucherID,
        UsageLimit: 1,
        DiscountValue: discountValue,
        MinimumOrderValue: 0,
        Status: 'Active',
        Pattern: voucherPattern,
      });
      await voucher.save();

      const mailOptions = {
        from: '"PetService" <petservicesswp391@gmail.com>',
        to: account.email,
        subject: "Chúc mừng quý khách hàng!",
        html: `<p>Chào bạn ${account.fullname},</p>
               <p>Xin chúc mừng bạn đã chính thức lên hạng ${account.membershipType} và nhận được voucher giảm giá ${discountValue} VNĐ cho lần mua hàng tiếp theo!</p>
               <p>Hãy tận hưởng những ưu đãi đặc biệt dành riêng cho thành viên ${account.membershipType} của chúng tôi. Đừng quên khám phá các sản phẩm và dịch vụ mới nhất tại PetService.</p>
               <p>Voucher của bạn có mã là: ${voucherPattern}. Hãy nhập mã này khi thanh toán để được giảm giá.</p>
               <p>Chúc bạn có những trải nghiệm mua sắm thú vị!</p>
               <p>Thân ái,</p>
               <p>Đội ngũ PetService</p>`,
      };

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        secure: false,
        port: 587,
        auth: {
          user: EMAIL_USERNAME,
          pass: EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: 'Total spent and membership updated successfully', account });
  } catch (error) {
    console.error('Error updating total spent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
