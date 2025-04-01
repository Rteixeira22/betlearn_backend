import express from "express";
import { StepsController } from "../controllers/stepsController";

const router = express.Router();
const stepsController = new StepsController();

//Get Steps Routes
router.get("/", stepsController.getSteps); // Get all steps
router.get("/:id", stepsController.getStepById); // Get step by ID
router.get("/ref_id_challenges/:ref_id_challenges", stepsController.getStepByRefIdChallenges); // Get step by ref_id_challenges
router.get("/step_video/:id_video", stepsController.getStepByVideoId); // Get step by video ID
router.get("/step_bet/:id_bet", stepsController.getStepByBetId); // Get step by bet ID
router.get("/step_view/:id_view", stepsController.getStepByViewId); // Get step by step view ID
router.get("/step_questionnaire/:id_questionnaire", stepsController.getStepByQuestionnaireId); // Get step by step Questionnaire ID

//Create Step Routes
router.post("/", stepsController.createNewStep); // Create a new step
router.post("/step_video", stepsController.createNewVideo); // Create a new step Video
router.post("/step_bet", stepsController.createNewStepBet); // Create a new step Bet
router.post("/step_view", stepsController.createNewStepView); // Create a new step View
router.post("/step_questionnaire", stepsController.createNewStepQuestionnaire); // Create a new step Questionnaire

//Update Step Routes
router.put("/step_video/:id_video", stepsController.updateStepVideo); // Update step Video by ID
router.put("/step_bet/:id_bet", stepsController.updateStepBet); // Update step Bet by ID
router.put("/step_view/:id_view", stepsController.updateStepView); // Update step View by ID
router.put("/step_questionnaire/:id_questionnaire", stepsController.updateStepQuestionnaire); // Update step Questionnaire by ID

//Delete Step Routes
router.delete("/:id", stepsController.deleteStep); // Delete step by ID

export default router;