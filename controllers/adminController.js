const adminModel = require("../models/adminModel");
const UserModel = require("../models/userModel"); // Make sure this exists
const passGen = require("../middlewares/passwordGenerator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../utils/emailTransporter"); // ✅ Importing the transporter

// ✅ Admin login controller with JWT and bcrypt
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.status(404).json({ msg: "Admin not found" });
        }

        if (admin.password !== password) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        return res.status(200).json({ msg: "Admin login successful" });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ msg: "Something went wrong" });
    }
};


// ✅ User creation controller with passGen and bcrypt
const userCreation = async (req, res) => {
    try {
        const { name, email, userid, designation } = req.body;

        // ✅ Check if user with same email or userid already exists
        const existingUser = await UserModel.findOne({ 
            $or: [ { email }, { userid } ] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User with this email or user ID already exists' 
            });
        }

        const myPass = passGen();
        const hashedPassword = await bcrypt.hash(myPass, 10);

        const newUser = await UserModel.create({
            name,
            email,
            userid,
            designation,
            password: hashedPassword
        });

        const mailOptions = {
            from: 'shahwalcomputer18@gmail.com',
            to: email,
            subject: 'Your Company Work Detail Account',
            text: `Dear ${name},\n\nYour account has been created.\n
Your userId: ${userid}\n
Your email: ${email}\n
Password: ${myPass}\n\nLogin using your email.\n\nBest Regards,\nAdmin`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ success: true, message: 'User Created & Email Sent!', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports = {
    adminLogin,
    userCreation
};
