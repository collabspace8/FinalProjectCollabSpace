
const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');

// Routes
router.post('/', workspaceController.createWorkspace);
router.put('/:id', workspaceController.updateWorkspace);
router.delete('/:id', workspaceController.deleteWorkspace);
router.get("/:id", workspaceController.getWorkspaceById);

module.exports = router;
