import express from "express";
import { QuestionnaireController } from "../controllers/questionnaireController";

const router = express.Router();
const questionnaireController = new QuestionnaireController();

// GET Questionnaire Routes
router.get("/:id/questionnaire", questionnaireController.getQuestionnaireByUserId); // Get questionnaire responses by user ID
router.get("/:id/questionnaire/verified", questionnaireController.getVerifiedQuestionnaires); // Get verified questionnaire responses
router.get("/:id/questionnaire/unverified", questionnaireController.getUnverifiedQuestionnaires); // Get unverified questionnaire responses
router.get("/:id/questionnaire/last", questionnaireController.getLastQuestionnaireResponse); // Get last questionnaire response by user ID

// POST Questionnaire Routes
router.post("/:id/questionnaire", questionnaireController.createQuestionnaireResponse); // Create a new questionnaire response

// PUT Questionnaire Routes
router.put("/:id/questionnaire/:responseId", questionnaireController.updateQuestionnaireResponse); // Update a specific questionnaire response

// DELETE Questionnaire Routes
router.delete("/:id/questionnaire/:responseId", questionnaireController.deleteQuestionnaireResponse); // Delete a specific questionnaire response


export default router;
