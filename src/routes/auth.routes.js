import express from 'express';
import { signup } from '#controllers/auth.controller.js';

const router = express.Router();

router.post('/sign-up', signup);

router.post('/sign-in', (req, res) => {
  res.send('in sign in');
});

router.post('/sign-out', (req, res) => {
  res.send('in sign out');
});

export default router;
