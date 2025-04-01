import express from "express";
import { BetsController } from "../controllers/betsController";

const router = express.Router();
const betsController = new BetsController();

// GET Bet Routes
router.get("/:id", betsController.getBetsByUserId); // Get bets by user ID
/* router.get("/:id/bets/active", betsController.getActiveUserBets); // Get active user bets
router.get("/:id/bets/concluded", betsController.getConcludedUserBets); // Get concluded user bets
router.get("/:id/bets/winning", betsController.getWinningUserBets); // Get winning user bets
router.get("/:id/bets/losing", betsController.getLosingUserBets); */ // Get losing user bets
router.get("/last/:id", betsController.getLastUserBets); // Get last bet by user ID
router.get("/count/:id", betsController.countUserBetsById); // Get count of bets by user ID

// POST Bet Routes
router.post("/:id_user/:id_championship", betsController.createBet); // Create a new bet

// Update Bet Routes
router.patch("/:id", betsController.updateBet); // Update a bet by ID

// Delete Bet Routes
router.delete("/:id", betsController.deleteBet); // Delete a bet by ID


export default router;