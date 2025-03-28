import express from "express";
import { ChampionsController } from "../controllers/championshipsController";

const router = express.Router();
const championsController = new ChampionsController();

//GETS
//TODOS
router.get("/", championsController.getAllChampionships);

//UM
router.get("/:id", championsController.getChampionshipById);

//POST
router.post("/", championsController.createChampionship);

//UPDATE
router.put("/:id", championsController.updateChampionship);

//DELETE
router.delete("/:id", championsController.deleteChampionship);

export default router;
