import express from 'express';
import { TipsController } from '../controllers/tipsController';

const router = express.Router();
const tipsController = new TipsController();

// GET Tip Routes
router.get('/', tipsController.getTips); // Get all tips
router.get('/:id', tipsController.getTipById); // Get tip by ID

// POST Tip Routes
router.post('/', tipsController.createTip); // Create tip

// PUT Tip Routes
router.put('/:id', tipsController.updateTip); // Update tip

export default router; // Export router