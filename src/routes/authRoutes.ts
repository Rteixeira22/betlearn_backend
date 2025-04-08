import express from 'express';
import { AuthController } from '../controllers/authController';

const router = express.Router();
const authController = new AuthController();

// Authentication Routes
router.post('/login', authController.login); // Login route

// Autentication Admin Routes
router.post('/admin/login', authController.adminLogin); // Admin login route

export default router;


