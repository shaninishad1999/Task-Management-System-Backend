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

    return res.status(200).json({
  msg: "Login successful",
  admin: {
    name: admin.name,
    email: admin.email
  }
});

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};


const userCreation = async (req, res) => {
  try {
    const { name, email, phone, userid, role } = req.body;

    // Check required fields
    if (!name || !email || !userid || !role) {
      return res.status(400).json({
        success: false,
        message: "All required fields (name, email, userid, role) must be provided.",
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { userid }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or user ID already exists.",
      });
    }

    // Generate password and hash
    const myPass = passGen();
    const hashedPassword = await bcrypt.hash(myPass, 10);

    // Create user
    const newUser = await UserModel.create({
      name,
      email,
      phone,
      userid,
      role,
      image: req.file ? req.file.path : "", // path from multer
      password: hashedPassword,
    });

    // Prepare email
    const mailOptions = {
      from: "shahwalcomputer18@gmail.com",
      to: email,
      subject: "Your Company Work Detail Account",
      text: `Dear ${name},\n\nYour account has been created.\n\n` +
            `User ID: ${userid}\nEmail: ${email}\nPassword: ${myPass}\n\n` +
            `Please log in using your email and this password.\n\nBest Regards,\nAdmin`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "User created and email sent successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const userDisplay = async (req, res) => {

  try {
    const users = await UserModel.find({}).select("-password"); // Exclude password from the response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
}


module.exports = {
  adminLogin,
  userCreation,
  userDisplay
};
