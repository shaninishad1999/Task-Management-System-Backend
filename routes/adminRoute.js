const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// ✅ Admin login route
router.post("/login", adminController.adminLogin);

// ✅ User creation route
router.post("/create-user", adminController.userCreation);

module.exports = router;
