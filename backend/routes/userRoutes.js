const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");

// Registration
router.post("/register", registrationController.createUser);

// Login
router.post("/login", registrationController.loginUser);

module.exports = router;
