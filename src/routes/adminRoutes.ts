import express from 'express';
import { AdminController } from '../controllers/adminController';

const router = express.Router();
const adminController = new AdminController();

// GET Admin Routes
router.get('/', adminController.getAdmins); // Get all admins
router.get('/:id', adminController.getAdminById); // Get admin by ID

// POST Admin Routes
router.post('/', adminController.createAdmin); // Create admin

// PUT Admin Routes
router.put('/:id', adminController.updateAdmin); // Update admin

// DELETE Admin Routes
router.delete('/:id', adminController.deleteAdmin); // Delete admin

export default router; // Export router