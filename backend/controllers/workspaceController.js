const { client } = require("../connect");
const Workspace = require("../models/workspaceModel");

// Add a new workspace
exports.addWorkspace = async (req, res) => {
  try {
    // Extract workspace data from request body
    const {
      propertyId,
      type,
      capacity,
      smoking,
      available,
      term,
      price,
      contactInfo,
    } = req.body;
    const image = req.file; 

    // Create a new workspace object
    const newWorkspace = {
      propertyId,
      type,
      capacity,
      smoking,
      available,
      term,
     price,
      contactInfo,
      image: {
        data: image.buffer, // Access the buffer containing image data
        contentType: image.mimetype // Access the mimetype of the image
      }
    };

    // Access the database and collection
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");

    // Insert the new workspace into the database
    const result = await collection.insertOne(newWorkspace);

    // Send response with inserted workspace data
    res.status(201).json({ message: "Workspace added successfully", data: result.ops[0] });
  } catch (error) {
    // Handle errors
    console.error("Error adding workspace:", error);
    res.status(500).json({ message: "Failed to add workspace", error: error.message });
  }
};

// Get all workspaces
exports.getAllWorkspaces = async (req, res) => {
  try {
    // Access the database and collection
    const db = client.db('CollabSpacedb');
    const collection = db.collection('Workspaces');
  
    // Retrieve all workspaces from the collection
    const workspaces = await collection.find({}).toArray();

    // Send response with all workspaces
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch workspaces', error: error.message });
  }
};

// Get a workspace by ID
exports.getWorkspaceById = async (req, res) => {
  try {
    // Access the database and collection
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");

    // Retrieve the workspace by ID
    const workspace = await collection.findOne({ _id: req.params.id });

    // Check if workspace exists
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Send response with the workspace
    res.status(200).json(workspace);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Failed to fetch workspace", error: error.message });
  }
};

// Update a workspace
exports.updateWorkspace = async (req, res) => {
  try {
    // Access the database and collection
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");

    // Update the workspace by ID
    const result = await collection.updateOne({ _id: req.params.id }, { $set: req.body });

    // Check if workspace was found and updated
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Send success response
    res.status(200).json({ message: "Workspace updated successfully" });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Failed to update workspace", error: error.message });
  }
};

// Delete a workspace
exports.deleteWorkspace = async (req, res) => {
  try {
    // Access the database and collection
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");

    // Delete the workspace by ID
    const result = await collection.deleteOne({ _id: req.params.id });

    // Check if workspace was found and deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Send success response
    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Failed to delete workspace", error: error.message });
  }
};
