import express from "express";
import { QuestionnaireController } from "../controllers/questionnaireController";

const router = express.Router();
const questionnaireController = new QuestionnaireController();

// GET Questionnaire Routes
router.get("/", questionnaireController.getAllQuestionnaires); // Get all questionnaires
router.get("/:id", questionnaireController.getQuestionnaireById); // Get questionnaire by ID
router.get("/user/:userId", questionnaireController.getQuestionnaireByUserId); // Get questionnaires by user ID
router.get("/verified/:userId", questionnaireController.getVerifiedQuestionnaires); // Get verified questionnaires by user ID
router.get("/unverified/:userId", questionnaireController.getUnverifiedQuestionnaires); // Get unverified questionnaires by user ID
router.get("/last/:userId", questionnaireController.getLastQuestionnaireResponse); // Get last questionnaire response by user ID

// POST Questionnaire Routes
router.post("/", questionnaireController.createQuestionnaireResponse); // Create a new questionnaire response

// PUT Questionnaire Routes
router.put("/:id", questionnaireController.updateQuestionnaireResponse); // Update a specific questionnaire response by ID

// DELETE Questionnaire Routes
router.delete("/:id", questionnaireController.deleteQuestionnaireResponse); // Delete a specific questionnaire response by ID

export default router;