const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");

// Add a new property
router.post("/add-property", propertyController.addProperty);

// Get all properties
router.get('/properties', propertyController.getAllProperties);

// Get a property by ID
router.get("/properties/:id", propertyController.getPropertyById);

// Update a property
router.put("/properties/:id", propertyController.updateProperty);

// Delete a property
router.delete("/properties/:id", propertyController.deleteProperty);

module.exports = router;
