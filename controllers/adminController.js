const adminModel = require("../models/adminModel");

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email: email });
    if (!admin) {
        return res.status(404).json({ msg: "Admin not found" });
    }

    if (admin.password !== password) {
        return res.status(401).json({ msg: "Password not matched" });
    }

    // Send a proper JSON response
    return res.status(200).json({ msg: "Admin login successful" });
};

module.exports = { adminLogin };
