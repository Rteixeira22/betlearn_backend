/**
 * @swagger
 * tags:
 *   name: Challenges
 *   description: Gestão de desafios
 */

/**
 * @swagger
 * /challenges:
 *   get:
 *     summary: Obtém todos os desafios
 *     tags: [Challenges]
 *     responses:
 *       200:
 *         description: Lista de desafios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 *       500:
 *         description: Erro ao buscar desafios
 */

/**
 * @swagger
 * /challenges/{id}:
 *   get:
 *     summary: Obtém um desafio pelo ID
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 1
 *     responses:
 *       200:
 *         description: Dados do desafio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       404:
 *         description: Desafio não encontrado
 *       500:
 *         description: Erro ao buscar desafio
 */

/**
 * @swagger
 * /challenges:
 *   post:
 *     summary: Cria um novo desafio
 *     tags: [Challenges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Desafio 1"
 *               short_description:
 *                 type: string
 *                 example: "Descrição curta"
 *               long_description:
 *                 type: string
 *                 example: "Descrição longa"
 *               image:
 *                 type: string
 *                 description: URL da imagem do desafio
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Desafio criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 challenge:
 *                   $ref: '#/components/schemas/Challenge'
 *                 steps:
 *                   type: array
 *                   description: Lista de passos criados
 *                   items:
 *                     $ref: '#/components/schemas/Step'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar desafio
 */

/**
 * @swagger
 * /challenges/{id}:
 *   patch:
 *     summary: Atualiza um desafio pelo ID
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Desafio Atualizado"
 *               short_description:
 *                 type: string
 *                 example: "Descrição curta atualizada"
 *               long_description:
 *                 type: string
 *                 example: "Descrição longa atualizada"
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Desafio atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Desafio não encontrado
 *       500:
 *         description: Erro ao atualizar desafio
 */

/**
 * @swagger
 * /challenges/{id}:
 *   delete:
 *     summary: Remove um desafio pelo ID
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 1
 *     responses:
 *       204:
 *         description: Desafio removido com sucesso
 *       404:
 *         description: Desafio não encontrado
 *       500:
 *         description: Erro ao remover desafio
 */

/**
 * @swagger
 * /challenges/{id}/steps:
 *   get:
 *     summary: Obtém os passos de um desafio pelo ID
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de passos do desafio
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "id_step": 1,
 *                   "ref_id_step_video": 1,
 *                   "ref_id_step_bet": null,
 *                   "ref_id_step_view": null,
 *                   "ref_id_step_questionnaire": null,
 *                   "ref_id_challenges": 3,
 *                   "description": "Passo 1 do desafio",
 *                   "order": 1
 *                 },
 *                 {
 *                   "id_step": 2,
 *                   "ref_id_step_video": null,
 *                   "ref_id_step_bet": null,
 *                   "ref_id_step_view": 1,
 *                   "ref_id_step_questionnaire": null,
 *                   "ref_id_challenges": 3,
 *                   "description": "Passo 2 do desafio",
 *                   "order": 2
 *                 }
 *               ]
 *       404:
 *         description: Desafio não encontrado
 *       500:
 *         description: Erro ao buscar passos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Challenge:
 *       type: object
 *       properties:
 *         id_challenge:
 *           type: integer
 *           description: ID do desafio
 *           example: 1
 *         number:
 *           type: integer
 *           description: Número do desafio
 *           example: 1
 *         name:
 *           type: string
 *           description: Nome do desafio
 *           example: "Desafio 1"
 *         short_description:
 *           type: string
 *           description: Descrição curta do desafio
 *           example: "Descrição curta"
 *         long_description:
 *           type: string
 *           description: Descrição longa do desafio
 *           example: "Descrição longa"
 *         image:
 *           type: string
 *           description: URL da imagem do desafio
 *           example: "https://example.com/image.jpg"
 */
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

// Get count of challenges
router.get("/count", challengeController.countChallenges);

//POST METHOTDS

// Create a new challenge
router.post("/", challengeController.createChallenge);

//create user has challenge
router.post(
  "/:id_user/:id_challenge",
  challengeController.createUserHasChallenges
);

// umblock next challenge
router.post(
  "/:id_user/:id_challenge/unblock-next",
  challengeController.unblockNextChallenge
);

//UPDATE METHOTDS

//update challenge by ID
router.patch("/:id", challengeController.updateChallengeById);

//update user has challenges detail_seen
router.patch(
  "/:id_user/:id_challenge",
  challengeController.updateUserHasChallengesDetailSeen
);

//update user has challenges progress_percentage
//este vai fazer com que o umblock next challenge seja chamado
router.patch(
  "/:id_user/:id_challenge/progress",
  challengeController.updateUserHasChallengesProgressPercentage
);

//update state dos challenges and update of progress_percentage  (aqui ter em atenção que recebe um array de steps- podemos atualizar o state de todos os steps de uma vez - depois de estarem todos ele vai puxar percentage atualize e se for 100 vai fazer o unblock next challenge)
router.patch(
  "/:id_user/:id_challenge/state",
  challengeController.updateUserHasStepState
);

//DELETE METHOTDS

//delete challenge by ID
router.delete("/:id", challengeController.deleteChallengeById);

export default router;
