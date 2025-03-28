import express from "express";
import { GamesController } from "../controllers/gamesController";

const router = express.Router();
const gamesController = new GamesController();

//GETS
//TODOS
router.get("/", gamesController.getAllGames);
//UM
router.get("/:id", gamesController.getGameById);

//POST
router.post("/", gamesController.createGame);

//UPDATE
router.put("/:id/:betId", gamesController.updateGameState);

//DELETE
router.delete("/:id", gamesController.deleteGame);

export default router;
