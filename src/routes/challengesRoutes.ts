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
 * /challenges/count:
 *   get:
 *     summary: Obtém a contagem total de desafios
 *     tags: [Challenges]
 *     responses:
 *       200:
 *         description: Contagem total de desafios
 *         content:
 *           application/json:
 *             example:
 *               count: 10
 *       500:
 *         description: Erro ao buscar a contagem de desafios
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to count challenges"
 */
/**
 * @swagger
 * /challenges/{id_user}/{id_challenge}:
 *   post:
 *     summary: Cria uma relação entre um utilizador e um desafio
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 1
 *       - in: path
 *         name: id_challenge
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 description: Define se o desafio foi completado
 *                 example: false
 *               blocked:
 *                 type: boolean
 *                 description: Define se o desafio está bloqueado
 *                 example: true
 *               detail_seen:
 *                 type: boolean
 *                 description: Define se os detalhes do desafio foram visualizados
 *                 example: false
 *     responses:
 *       201:
 *         description: Relação criada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               ref_id_user: 1
 *               ref_id_challenge: 2
 *               completed: false
 *               blocked: true
 *               detail_seen: false
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             example:
 *               error: "Missing required fields: completed, blocked, and detail_seen are required"
 *       404:
 *         description: Utilizador ou desafio não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "User not found"
 *       409:
 *         description: Relação já existente entre utilizador e desafio
 *         content:
 *           application/json:
 *             example:
 *               error: "This user already has this challenge assigned"
 *       500:
 *         description: Erro ao criar a relação
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to create user has challenge"
 */
/**
 * @swagger
 * /challenges/{id_user}/{id_challenge}/unblock-next:
 *   post:
 *     summary: Desbloqueia o próximo desafio para um utilizador
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 1
 *       - in: path
 *         name: id_challenge
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio atual
 *         example: 2
 *     responses:
 *       200:
 *         description: Próximo desafio desbloqueado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               ref_id_user: 1
 *               ref_id_challenge: 3
 *               completed: false
 *               blocked: false
 *               detail_seen: false
 *       404:
 *         description: Desafio atual ou próximo desafio não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "No next challenge found"
 *       500:
 *         description: Erro ao desbloquear o próximo desafio
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to unblock next challenge"
 */
/**
 * @swagger
 * /challenges/{id_user}/{id_challenge}:
 *   patch:
 *     summary: Atualiza o campo detail_seen de um desafio para um utilizador
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 1
 *       - in: path
 *         name: id_challenge
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               detail_seen:
 *                 type: boolean
 *                 description: Define se os detalhes do desafio foram visualizados
 *                 example: true
 *     responses:
 *       200:
 *         description: Campo detail_seen atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id_user: 1
 *               id_challenge: 2
 *               detail_seen: true
 *       404:
 *         description: Relação entre utilizador e desafio não encontrada
 *       500:
 *         description: Erro ao atualizar o campo detail_seen
 */
/**
 * @swagger
 * /challenges/{id_user}/{id_challenge}/progress:
 *   patch:
 *     summary: Atualiza a percentagem de progresso de um desafio para um utilizador
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 1
 *       - in: path
 *         name: id_challenge
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress_percentage:
 *                 type: number
 *                 description: Percentagem de progresso do desafio (0 a 100)
 *                 example: 75
 *     responses:
 *       200:
 *         description: Percentagem de progresso atualizada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id_user: 1
 *               id_challenge: 2
 *               progress_percentage: 75
 *       400:
 *         description: "Dados inválidos (ex.: percentagem fora do intervalo permitido)"
 *       404:
 *         description: Relação entre utilizador e desafio não encontrada
 *       500:
 *         description: Erro ao atualizar a percentagem de progresso
 */
/**
 * @swagger
 * /challenges/{id_user}/{id_challenge}/state:
 *   patch:
 *     summary: Atualiza o estado de um ou mais passos de um desafio e calcula a percentagem de progresso
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 1
 *       - in: path
 *         name: id_challenge
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ref_id_steps:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs dos passos a serem atualizados
 *                 example: [1, 2, 3]
 *               state:
 *                 type: integer
 *                 description: Novo estado dos passos (0 para incompleto, 1 para completo)
 *                 example: 1
 *     responses:
 *       200:
 *         description: Estado dos passos e percentagem de progresso atualizados com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: "Step state updated successfully"
 *               progress_percentage: 100
 *               progress_response:
 *                 progress_percentage: 100
 *               updatedStep:
 *                 count: 3
 *       404:
 *         description: Relação entre utilizador e desafio não encontrada
 *       500:
 *         description: Erro ao atualizar o estado dos passos
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
 * components:
 *   schemas:
 *     Challenges:
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
// Get count of challenges
router.get("/count", challengeController.countChallenges);

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
