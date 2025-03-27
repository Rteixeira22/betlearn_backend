import express from "express";
import { GamesController } from "../controllers/gamesController";

const router = express.Router();
const gamesController = new GamesController();

//Escrever aqui as rotas

export default router;