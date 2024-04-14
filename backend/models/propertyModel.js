
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  neighborhood: {
    type: String,
    required: true
  },
  squareFeet: {
    type: Number,
    required: true
  },
  parking: {
    type: String,
    required: true
  },
  publicTranspo: {
    type: String,
    required: true
  },
  workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }]
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;