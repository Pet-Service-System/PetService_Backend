const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

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
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let account = await Account.findOne({ email: profile.emails[0].value });

      if (!account) {
        const accountID = await generateAccountID();
        account = new Account({
          AccountID: accountID,
          fullname: profile.displayName,
          email: profile.emails[0].value,
          password: "", // Google account, no password needed
          address: "", 
          phone: "", 
          status: "Available", 
          role: "Customer"
        });
        await account.save();
      }

      const payload = { id: account._id, role: account.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

      return done(null, { account, token });
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.account.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const account = await Account.findById(id);
    done(null, account);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
