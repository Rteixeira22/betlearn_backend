import express from "express";
import { QuestionnaireController } from "../controllers/questionnaireController";

const router = express.Router();
const questionnaireController = new QuestionnaireController();

//Escrever aqui as rotas

export default router;