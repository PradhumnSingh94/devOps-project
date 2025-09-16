import express from 'express';
import { signup, signin, signout } from '#controllers/auth.controller.js';
import { authenticateToken, requireRole } from '#middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/sign-up', signup);
router.post('/sign-in', signin);
router.get('/sign-out', signout);

// Protected routes (examples)
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Profile data',
    user: req.user,
  });
});

router.get('/admin', authenticateToken, requireRole('admin'), (req, res) => {
  res.json({
    message: 'Admin only content',
    user: req.user,
  });
});

export default router;
