import express from "express";
import { QuestionnaireController } from "../controllers/questionnaireController";

const router = express.Router();
const questionnaireController = new QuestionnaireController();

// GET Questionnaire Routes
router.get("/questionnaire/:id", questionnaireController.getQuestionnaireByUserId); // Get questionnaire responses by user ID
router.get("/questionnaire/:id/verified", questionnaireController.getVerifiedQuestionnaires); // Get verified questionnaire responses
router.get("/questionnaire/:id/unverified", questionnaireController.getUnverifiedQuestionnaires); // Get unverified questionnaire responses
router.get("/questionnaire/:id/last", questionnaireController.getLastQuestionnaireResponse); // Get last questionnaire response by user ID

// POST Questionnaire Routes
router.post("/questionnaire/:id", questionnaireController.createQuestionnaireResponse); // Create a new questionnaire response

// PUT Questionnaire Routes
router.put("/questionnaire/:id/:responseId", questionnaireController.updateQuestionnaireResponse); // Update a specific questionnaire response

// DELETE Questionnaire Routes
router.delete("/questionnaire/:id/:responseId", questionnaireController.deleteQuestionnaireResponse); // Delete a specific questionnaire response

export default router;