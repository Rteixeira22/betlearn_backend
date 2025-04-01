import express from "express";
import { ChallengesController } from "../controllers/challengesController";

const router = express.Router();
const challengeController = new ChallengesController();

//GET METHOTHDS

// Get all challenges
router.get("/", challengeController.getAllChallenges);

// Get challenge by ID
router.get("/:id", challengeController.getChallengeById);

// Get steps by challenge ID
router.get("/:id/steps", challengeController.getStepsByChallengeId);




//POST METHOTDS

// Create a new challenge
router.post("/", challengeController.createChallenge);

//create user has challenge
router.post("/:id_user/:id_challenge", challengeController.createUserHasChallenges);

// umblock next challenge
router.post("/:id_user/:id_challenge/unblock-next", challengeController.unblockNextChallenge);



//UPDATE METHOTDS

//update challenge by ID
router.patch("/:id", challengeController.updateChallengeById);

//update user has challenges detail_seen
router.patch("/:id_user/:id_challenge", challengeController.updateUserHasChallengesDetailSeen);

//update user has challenges progress_percentage
//este vai fazer com que o umblock next challenge seja chamado 
router.patch("/:id_user/:id_challenge/progress", challengeController.updateUserHasChallengesProgressPercentage);

//update state dos challenges and update of progress_percentage  (aqui ter em atenção que recebe um array de steps- podemos atualizar o state de todos os steps de uma vez - depois de estarem todos ele vai puxar percentage atualize e se for 100 vai fazer o unblock next challenge)
router.patch("/:id_user/:id_challenge/state", challengeController.updateUserHasStepState );


//DELETE METHOTDS

//delete challenge by ID
router.delete("/:id", challengeController.deleteChallengeById);

export default router;
