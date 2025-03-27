import express from "express";
import { ChampionsController } from "../controllers/championshipsController";

const router = express.Router();
const championsController = new ChampionsController();

//Escrever aqui as rotas

export default router;