const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Account = require("./models/Account"); // Import the Account model

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://minhvqse183085:mv1212@pet-management-sysem.2jvqldt.mongodb.net/Pet-Management-System?retryWrites=true&w=majority&appName=Pet-Management-Sysem", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const account = await Account.findOne({ email, password });

        if (account) {
            let redirectPage;
            if (account.role === '1' || account.role === '2') {
                redirectPage = 'homepage';
            } else {
                redirectPage = 'adminpage';
            }
            res.json({ message: 'Login successful', user: { email: account.email, role: account.role }, redirectPage });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// Reset Password endpoint
app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Find the account by email
        const account = await Account.findOne({ email });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Update the password
        account.password = newPassword;
        await account.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.listen(3001, () => {
    console.log('Server is running on port 3001');
})