import express from "express";
import { ChallengesController } from "../controllers/challengesController";

const router = express.Router();
const challengeController = new ChallengesController();

//Escrever aqui as rotas

export default router;