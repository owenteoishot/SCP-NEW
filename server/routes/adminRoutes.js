const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Admins only
router.get('/users', authenticate, authorize(['admin']), adminController.getAllUsers);
router.post('/promote/:userId', authenticate, authorize(['admin']), adminController.promoteUser);
router.post('/demote/:userId', authenticate, authorize(['admin']), adminController.demoteUser);
router.delete('/user/:userId', authenticate, authorize(['admin']), adminController.deleteUser);

// Admins and moderators
router.delete('/post/:postId', authenticate, authorize(['admin', 'moderator']), adminController.deletePost);


module.exports = router;
