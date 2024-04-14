// workspaceModel.js

const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  workspaceId: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  smoking: {
    type: String, // Assuming smoking status as string ("Yes" or "No")
    enum: ["Yes", "No"], // Restricting smoking status to predefined values
    default: "No", // Default value set to "No" if not provided
  },
  available: {
    type: Date,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: null,
  },
  image: {
    data: {
      type: Buffer,
      required: false,
    },
    contentType: {
      type: String,
      required: false,
    },
  },
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = Workspace;
