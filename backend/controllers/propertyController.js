const { client } = require("../connect");

// Add a new property
exports.addProperty = async (req, res) => {
  try {
    // Extract property data from request body
    const { address, neighborhood, squarefeet, parking, publicTranspo } = req.body;

    // Create a new property object
    const newProperty = {
      address,
      neighborhood,
      squarefeet,
      parking,
      publicTranspo,
    };

    // Access the database and collection
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");

    // Insert the new property into the database
    const result = await collection.insertOne(newProperty);

    // Send response with inserted property data
    res.status(201).json({ message: "Property added successfully", data: result.ops[0] });
  } catch (error) {
    // Handle errors
    console.error("Error adding property:", error);
    res.status(500).json({ message: "Failed to add property", error: error.message });
  }
};

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    // Access the database and collection
    const db = client.db('CollabSpacedb');
    const collection = db.collection('Properties');
  
    // Retrieve all properties from the collection
    const properties = await collection.find({}).toArray();

    // Send response with all properties
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
  }
};

// Get a property by ID
exports.getPropertyById = async (req, res) => {
  try {
    // Access the database and collection
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");

    // Retrieve the property by ID
    const property = await collection.findOne({ _id: req.params.id });

    // Check if property exists
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Send response with the property
    res.status(200).json(property);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Failed to fetch property", error: error.message });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  try {
    // Access the database and collection
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");

    // Update the property by ID
    const result = await collection.updateOne({ _id: req.params.id }, { $set: req.body });

    // Check if property was found and updated
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Send success response
    res.status(200).json({ message: "Property updated successfully" });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Failed to update property", error: error.message });
  }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
  try {
    // Access the database and collection
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");

    // Delete the property by ID
    const result = await collection.deleteOne({ _id: req.params.id });

    // Check if property was found and deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Send success response
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Failed to delete property", error: error.message });
  }
};
