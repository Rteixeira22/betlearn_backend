/**
 * @swagger
 * tags:
 *   name: Steps
 *   description: Gestão de passos (steps) no sistema
 */

/**
 * @swagger
 * /steps:
 *   get:
 *     summary: Obtém todos os passos.
 *     tags: [Steps]
 *     responses:
 *       200:
 *         description: Lista de passos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stepss'
 *       500:
 *         description: Erro ao buscar passos.
 */

/**
 * @swagger
 * /steps/{id}:
 *   get:
 *     summary: Obtém um passo pelo ID.
 *     tags: [Steps]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do passo.
 *     responses:
 *       200:
 *         description: Passo encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stepss'
 *       500:
 *         description: Erro ao buscar o passo.
 */

/**
 * @swagger
 * /steps/ref_id_challenges/{ref_id_challenges}:
 *   get:
 *     summary: Obtém passos por ID de desafio.
 *     tags: [Steps]
 *     parameters:
 *       - name: ref_id_challenges
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do desafio associado ao passo.
 *     responses:
 *       200:
 *         description: Lista de passos associados ao desafio.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Steps'
 *       500:
 *         description: Erro ao buscar passos.
 */

/**
 * @swagger
 * /steps/step_video/{id_video}:
 *   get:
 *     summary: Obtém passos por ID de vídeo.
 *     tags: [Steps]
 *     parameters:
 *       - name: id_video
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do vídeo associado ao passo.
 *     responses:
 *       200:
 *         description: Lista de passos associados ao vídeo.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StepsVideo'
 *       500:
 *         description: Erro ao buscar passos.
 */

/**
 * @swagger
 * /steps/step_bet/{id_bet}:
 *   get:
 *     summary: Obtém passos por ID de aposta.
 *     tags: [Steps]
 *     parameters:
 *       - name: id_bet
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID da aposta associada ao passo.
 *     responses:
 *       200:
 *         description: Lista de passos associados à aposta.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StepsBet'
 *       500:
 *         description: Erro ao buscar passos.
 */

/**
 * @swagger
 * /steps/step_view/{id_view}:
 *   get:
 *     summary: Obtém passos por ID de visualização.
 *     tags: [Steps]
 *     parameters:
 *       - name: id_view
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID da visualização associada ao passo.
 *     responses:
 *       200:
 *         description: Lista de passos associados à visualização.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StepsView'
 *       500:
 *         description: Erro ao buscar passos.
 */

/**
 * @swagger
 * /steps/step_questionnaire/{id_questionnaire}:
 *   get:
 *     summary: Obtém passos por ID de questionário.
 *     tags: [Steps]
 *     parameters:
 *       - name: id_questionnaire
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do questionário associado ao passo.
 *     responses:
 *       200:
 *         description: Lista de passos associados ao questionário.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StepsQuestionnaire'
 *       500:
 *         description: Erro ao buscar passos.
 */
/**
 * @swagger
 * /steps/step_video:
 *   post:
 *     summary: Cria um novo vídeo associado a um passo.
 *     tags: [Steps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               video_url:
 *                 type: string
 *                 description: URL do vídeo.
 *               video_description:
 *                 type: string
 *                 description: Descrição do vídeo.
 *             required:
 *               - video_url
 *               - video_description
 *     responses:
 *       201:
 *         description: Vídeo criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StepsVideo'
 *       500:
 *         description: Erro ao criar o vídeo.
 */

/**
 * @swagger
 * /steps/step_bet:
 *   post:
 *     summary: Cria uma nova aposta associada a um passo.
 *     tags: [Steps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bet_description:
 *                 type: string
 *                 description: Descrição da aposta.
 *               bet_json:
 *                 type: string
 *                 description: JSON com detalhes da aposta.
 *             required:
 *               - bet_description
 *               - bet_json
 *     responses:
 *       201:
 *         description: Aposta criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StepsBet'
 *       500:
 *         description: Erro ao criar a aposta.
 */

/**
 * @swagger
 * /steps/step_view:
 *   post:
 *     summary: Cria uma nova visualização associada a um passo.
 *     tags: [Steps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               view_description:
 *                 type: string
 *                 description: Descrição da visualização.
 *               view_page:
 *                 type: string
 *                 description: Página associada à visualização.
 *             required:
 *               - view_description
 *               - view_page
 *     responses:
 *       201:
 *         description: Visualização criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StepsView'
 *       500:
 *         description: Erro ao criar a visualização.
 */

/**
 * @swagger
 * /steps/step_questionnaire:
 *   post:
 *     summary: Cria um novo questionário associado a um passo.
 *     tags: [Steps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionnaire_description:
 *                 type: string
 *                 description: Descrição do questionário.
 *               questionnaire_json:
 *                 type: string
 *                 description: JSON com detalhes do questionário.
 *             required:
 *               - questionnaire_description
 *               - questionnaire_json
 *     responses:
 *       201:
 *         description: Questionário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StepsQuestionnaire'
 *       500:
 *         description: Erro ao criar o questionário.
 */
/**
 * @swagger
 * /steps:
 *   post:
 *     summary: Cria um novo passo.
 *     tags: [Steps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ref_id_step_video:
 *                 type: integer
 *                 description: ID do vídeo associado ao passo.
 *               ref_id_step_bet:
 *                 type: integer
 *                 description: ID da aposta associada ao passo.
 *               ref_id_step_view:
 *                 type: integer
 *                 description: ID da visualização associada ao passo.
 *               ref_id_step_questionnaire:
 *                 type: integer
 *                 description: ID do questionário associado ao passo.
 *               ref_id_challenges:
 *                 type: integer
 *                 description: ID do desafio associado ao passo.
 *             required:
 *               - ref_id_challenges
 *     responses:
 *       201:
 *         description: Passo criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Steps'
 *       500:
 *         description: Erro ao criar o passo.
 */
/**
 * @swagger
 * /steps/progress_percentage/{id}:
 *   put:
 *     summary: Atualiza o progresso de um passo.
 *     tags: [Steps]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do desafio associado ao passo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ref_id_user:
 *                 type: integer
 *                 description: ID do utilizador associado ao desafio.
 *               progress_percentage:
 *                 type: number
 *                 description: Percentagem de progresso do passo.
 *             required:
 *               - ref_id_user
 *               - progress_percentage
 *     responses:
 *       200:
 *         description: Progresso do passo atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ref_id_user:
 *                   type: integer
 *                   description: ID do utilizador.
 *                 progress_percentage:
 *                   type: number
 *                   description: Percentagem de progresso atualizada.
 *       500:
 *         description: Erro ao atualizar o progresso do passo.
 */

/**
 * @swagger
 * /steps/step_video/{id_video}:
 *   put:
 *     summary: Atualiza os detalhes de um vídeo associado a um passo.
 *     tags: [Steps]
 *     parameters:
 *       - name: id_video
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do vídeo associado ao passo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               video_url:
 *                 type: string
 *                 description: URL do vídeo.
 *               video_description:
 *                 type: string
 *                 description: Descrição do vídeo.
 *             required:
 *               - video_url
 *               - video_description
 *     responses:
 *       200:
 *         description: Vídeo atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StepsVideo'
 *       500:
 *         description: Erro ao atualizar o vídeo.
 */

/**
 * @swagger
 * /steps/step_bet/{id_bet}:
 *   put:
 *     summary: Atualiza os detalhes de uma aposta associada a um passo.
 *     tags: [Steps]
 *     parameters:
 *       - name: id_bet
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID da aposta associada ao passo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bet_description:
 *                 type: string
 *                 description: Descrição da aposta.
 *               bet_json:
 *                 type: string
 *                 description: JSON com detalhes da aposta.
 *             required:
 *               - bet_description
 *               - bet_json
 *     responses:
 *       200:
 *         description: Aposta atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StepsBet'
 *       500:
 *         description: Erro ao atualizar a aposta.
 */

/**
 * @swagger
 * /steps/step_view/{id_view}:
 *   put:
 *     summary: Atualiza os detalhes de uma visualização associada a um passo.
 *     tags: [Steps]
 *     parameters:
 *       - name: id_view
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID da visualização associada ao passo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               view_description:
 *                 type: string
 *                 description: Descrição da visualização.
 *               view_page:
 *                 type: string
 *                 description: Página associada à visualização.
 *             required:
 *               - view_description
 *               - view_page
 *     responses:
 *       200:
 *         description: Visualização atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StepsView'
 *       500:
 *         description: Erro ao atualizar a visualização.
 */

/**
 * @swagger
 * /steps/step_questionnaire/{id_questionnaire}:
 *   put:
 *     summary: Atualiza os detalhes de um questionário associado a um passo.
 *     tags: [Steps]
 *     parameters:
 *       - name: id_questionnaire
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do questionário associado ao passo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionnaire_description:
 *                 type: string
 *                 description: Descrição do questionário.
 *               questionnaire_json:
 *                 type: string
 *                 description: JSON com detalhes do questionário.
 *             required:
 *               - questionnaire_description
 *               - questionnaire_json
 *     responses:
 *       200:
 *         description: Questionário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StepsQuestionnaire'
 *       500:
 *         description: Erro ao atualizar o questionário.
 */
/**
 * @swagger
 * /steps/{id}:
 *   delete:
 *     summary: Apaga um passo pelo ID.
 *     tags: [Steps]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do passo a ser apagado.
 *     responses:
 *       200:
 *         description: Passo apagado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Step deleted successfully"
 *       500:
 *         description: Erro ao Apagar o passo.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Steps:
 *       type: object
 *       properties:
 *         id_step:
 *           type: integer
 *           description: ID único do passo.
 *         ref_id_step_video:
 *           type: integer
 *           description: ID do vídeo associado ao passo.
 *         ref_id_step_bet:
 *           type: integer
 *           description: ID da aposta associada ao passo.
 *         ref_id_step_view:
 *           type: integer
 *           description: ID da visualização associada ao passo.
 *         ref_id_step_questionnaire:
 *           type: integer
 *           description: ID do questionário associado ao passo.
 *         ref_id_challenges:
 *           type: integer
 *           description: ID do desafio associado ao passo.
 *     StepVideo:
 *       type: object
 *       properties:
 *         id_step_video:
 *           type: integer
 *           description: ID único do vídeo.
 *         video_url:
 *           type: string
 *           description: URL do vídeo.
 *         video_description:
 *           type: string
 *           description: Descrição do vídeo.
 *     StepBet:
 *       type: object
 *       properties:
 *         id_step_bet:
 *           type: integer
 *           description: ID único da aposta.
 *         bet_description:
 *           type: string
 *           description: Descrição da aposta.
 *         bet_json:
 *           type: string
 *           description: JSON com detalhes da aposta.
 *     StepView:
 *       type: object
 *       properties:
 *         id_step_view:
 *           type: integer
 *           description: ID único da visualização.
 *         view_description:
 *           type: string
 *           description: Descrição da visualização.
 *         view_page:
 *           type: string
 *           description: Página associada à visualização.
 *     StepQuestionnaire:
 *       type: object
 *       properties:
 *         id_step_questionnaire:
 *           type: integer
 *           description: ID único do questionário.
 *         questionnaire_description:
 *           type: string
 *           description: Descrição do questionário.
 *         questionnaire_json:
 *           type: string
 *           description: JSON com detalhes do questionário.
 */
import express from "express";
import { StepsController } from "../controllers/stepsController";

const router = express.Router();
const stepsController = new StepsController();

//Get Steps Routes
router.get("/", stepsController.getSteps); // Get all steps
router.get("/:id", stepsController.getStepById); // Get step by ID
router.get(
  "/ref_id_challenges/:ref_id_challenges",
  stepsController.getStepByRefIdChallenges
); // Get step by ref_id_challenges
router.get("/user_challenge_step/:id_user/:id_challenge/:id_step", stepsController.getUserHasChallengesByUserAndChallengeId); // Get step by User ID and Challenge ID and Step ID
router.get("/step_video/:id_video", stepsController.getStepByVideoId); // Get step by video ID
router.get("/step_bet/:id_bet", stepsController.getStepByBetId); // Get step by bet ID
router.get("/step_view/:id_view", stepsController.getStepByViewId); // Get step by step view ID
router.get(
  "/step_questionnaire/:id_questionnaire",
  stepsController.getStepByQuestionnaireId
); // Get step by step Questionnaire ID

//Create Step Routes
router.post("/", stepsController.createNewStep); // Create a new step
router.post("/step_video", stepsController.createNewVideo); // Create a new step Video
router.post("/step_bet", stepsController.createNewStepBet); // Create a new step Bet
router.post("/step_view", stepsController.createNewStepView); // Create a new step View
router.post("/step_questionnaire", stepsController.createNewStepQuestionnaire); // Create a new step Questionnaire

//Update Step Routes
router.put("/progress_percentage/:id", stepsController.updateStepProgress); // Update step progress by ID
router.put("/step_video/:id_video", stepsController.updateStepVideo); // Update step Video by ID
router.put("/step_bet/:id_bet", stepsController.updateStepBet); // Update step Bet by ID
router.put("/step_view/:id_view", stepsController.updateStepView); // Update step View by ID
router.put(
  "/step_questionnaire/:id_questionnaire",
  stepsController.updateStepQuestionnaire
); // Update step Questionnaire by ID

//Delete Step Routes
router.delete("/:id", stepsController.deleteStep); // Delete step by ID

export default router;
