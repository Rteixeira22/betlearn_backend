import express from "express";
import { BetsController } from "../controllers/betsController";

const router = express.Router();
const betsController = new BetsController();

// GET Bet Routes
router.get("/:id/bets", betsController.getBetsByUserId); // Get bets by user ID
/* router.get("/:id/bets/active", betsController.getActiveUserBets); // Get active user bets
router.get("/:id/bets/concluded", betsController.getConcludedUserBets); // Get concluded user bets
router.get("/:id/bets/winning", betsController.getWinningUserBets); // Get winning user bets
router.get("/:id/bets/losing", betsController.getLosingUserBets); */ // Get losing user bets
router.get("/:id/bets/last", betsController.getLastUserBets); // Get last bet by user ID

// POST Bet Routes


export default router;