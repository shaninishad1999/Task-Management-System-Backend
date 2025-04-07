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
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

const userCreation = async (req, res) => {
  // console.log("req.body:", req.body);

  try {
    const { name, email, phone, userid, role, image, department } = req.body;

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
      department,
      image: req.file ? req.file.path : "", // path from multer
      password: hashedPassword,
    });

    // Prepare email
    const mailOptions = {
      from: "shahwalcomputer18@gmail.com",
      to: email,
      subject: "Your Company Work Detail Account",
      text:
        `Dear ${name},\n\nYour account has been created.\n\n` +
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
};

const userUpdate = async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  const { id } = req.params;
  const { name, email, phone, userid, role, department } = req.body;

  try {
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    existingUser.name = name || existingUser.name;
    existingUser.email = email || existingUser.email;
    existingUser.phone = phone || existingUser.phone;
    existingUser.userid = userid || existingUser.userid;
    existingUser.role = role || existingUser.role;
    existingUser.department = department || existingUser.department;

    if (req.file) {
      existingUser.image = req.file.path;
    }

    await existingUser.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: existingUser,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const userDelete = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if user exists
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Delete user
    await UserModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
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
  userDisplay,userUpdate,userDelete
};
