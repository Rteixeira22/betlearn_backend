import express from "express";
import { LeaderboardController } from "../controllers/leaderboardController";

const router = express.Router();
const leaderboardController = new LeaderboardController();

//Escrever aqui as rotas

export default router;