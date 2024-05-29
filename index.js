const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Account = require("./models/accounts"); // Import the Account model

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
    const { username, password } = req.body;

    try {
        const account = await Account.findOne({ username, password });

        if (account) {
            res.json({ message: 'Login successful', user: { username: account.username, role: account.role } });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
