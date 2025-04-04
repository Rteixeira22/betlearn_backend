/**
 * @swagger
 * tags:
 *   name: Questionnaire
 *   description: Gestão do questionário de onboarding
 */

/**
 * @swagger
 * /questionnaire:
 *   get:
 *     summary: Obtém todas as respostas de questionários.
 *     tags: [Questionnaire]
 *     responses:
 *       200:
 *         description: Lista de respostas de questionários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuestionnaireResponse'
 *       500:
 *         description: Erro ao buscar respostas.
 */
/**
 * @swagger
 * /questionnaire:
 *   post:
 *     summary: Cria uma nova resposta de questionário.
 *     tags: [Questionnaire]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               budget:
 *                 type: number
 *                 description: Orçamento do utilizador.
 *               verification:
 *                 type: boolean
 *                 description: Indica se a resposta foi verificada.
 *               salary:
 *                 type: number
 *                 description: Salário do utilizador.
 *               expenses:
 *                 type: number
 *                 description: Despesas do utilizador.
 *               available_amount:
 *                 type: number
 *                 description: Quantia disponível do utilizador.
 *               debt:
 *                 type: number
 *                 description: Dívida total do utilizador.
 *               debt_monthly:
 *                 type: number
 *                 description: Pagamento mensal da dívida.
 *               income_source:
 *                 type: number
 *                 description: Fonte de renda do utilizador.
 *               ref_id_user:
 *                 type: integer
 *                 description: ID do utilizador associado à resposta.
 *             required:
 *               - budget
 *               - verification
 *               - salary
 *               - expenses
 *               - available_amount
 *               - debt
 *               - debt_monthly
 *               - income_source
 *               - ref_id_user
 *     responses:
 *       201:
 *         description: Resposta criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_questionnaire_response:
 *                   type: integer
 *                   description: ID único da resposta criada.
 *                 budget:
 *                   type: number
 *                   description: Orçamento do utilizador.
 *                 verification:
 *                   type: boolean
 *                   description: Indica se a resposta foi verificada.
 *                 salary:
 *                   type: number
 *                   description: Salário do utilizador.
 *                 expenses:
 *                   type: number
 *                   description: Despesas do utilizador.
 *                 available_amount:
 *                   type: number
 *                   description: Quantia disponível do utilizador.
 *                 debt:
 *                   type: number
 *                   description: Dívida total do utilizador.
 *                 debt_monthly:
 *                   type: number
 *                   description: Pagamento mensal da dívida.
 *                 income_source:
 *                   type: string
 *                   description: Fonte de renda do utilizador.
 *                 ref_id_user:
 *                   type: integer
 *                   description: ID do utilizador associado à resposta.
 *       500:
 *         description: Erro ao criar a resposta.
 */

/**
 * @swagger
 * /questionnaire/{id}:
 *   get:
 *     summary: Obtém uma resposta de questionário pelo ID.
 *     tags: [Questionnaire]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         example: 1
 *         schema:
 *           type: integer
 *         description: ID da resposta do questionário.
 *     responses:
 *       200:
 *         description: Resposta do questionário encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestionnaireResponse'
 *       404:
 *         description: Resposta do questionário não encontrada.
 *       500:
 *         description: Erro ao buscar a resposta.
 */
/**
 * @swagger
 * /questionnaire/{id}:
 *   put:
 *     summary: Atualiza uma resposta de questionário pelo ID.
 *     tags: [Questionnaire]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID da resposta do questionário a ser atualizada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               budget:
 *                 type: number
 *                 description: Orçamento do utilizador.
 *               verification:
 *                 type: boolean
 *                 description: Indica se a resposta foi verificada.
 *               salary:
 *                 type: number
 *                 description: Salário do utilizador.
 *               expenses:
 *                 type: number
 *                 description: Despesas do utilizador.
 *               available_amount:
 *                 type: number
 *                 description: Quantia disponível do utilizador.
 *               debt:
 *                 type: number
 *                 description: Dívida total do utilizador.
 *               debt_monthly:
 *                 type: number
 *                 description: Pagamento mensal da dívida.
 *               income_source:
 *                 type: number
 *                 description: Fonte de renda do utilizador.
 *             required:
 *               - budget
 *               - verification
 *               - salary
 *               - expenses
 *               - available_amount
 *               - debt
 *               - debt_monthly
 *               - income_source
 *     responses:
 *       200:
 *         description: Resposta atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestionnaireResponse'
 *       404:
 *         description: Resposta do questionário não encontrada.
 *       500:
 *         description: Erro ao atualizar a resposta.
 */

/**
 * @swagger
 * /questionnaire/user/{userId}:
 *   get:
 *     summary: Obtém todas as respostas de questionários de um utilizador.
 *     tags: [Questionnaire]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     responses:
 *       200:
 *         description: Lista de respostas do utilizador.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuestionnaireResponse'
 *       500:
 *         description: Erro ao buscar respostas.
 */

/**
 * @swagger
 * /questionnaire/verified/{userId}:
 *   get:
 *     summary: Obtém todas as respostas verificadas de questionários de um utilizador.
 *     tags: [Questionnaire]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     responses:
 *       200:
 *         description: Lista de respostas verificadas do utilizador.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuestionnaireResponse'
 *       500:
 *         description: Erro ao buscar respostas.
 */

/**
 * @swagger
 * /questionnaire/unverified/{userId}:
 *   get:
 *     summary: Obtém todas as respostas não verificadas de questionários de um utilizador.
 *     tags: [Questionnaire]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     responses:
 *       200:
 *         description: Lista de respostas não verificadas do utilizador.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuestionnaireResponse'
 *       500:
 *         description: Erro ao procurar respostas.
 */

/**
 * @swagger
 * /questionnaire/last/{userId}:
 *   get:
 *     summary: Obtém a última resposta de questionário de um utilizador.
 *     tags: [Questionnaire]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     responses:
 *       200:
 *         description: Última resposta do utilizador encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestionnaireResponse'
 *       500:
 *         description: Erro ao buscar a última resposta.
 */
/**
 * @swagger
 * /questionnaire/{id}:
 *   delete:
 *     summary: Apaga uma resposta de questionário pelo ID.
 *     tags: [Questionnaire]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID da resposta do questionário a ser apagada.
 *     responses:
 *       200:
 *         description: Resposta Apagada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Questionnaire response deleted successfully"
 *       404:
 *         description: Resposta do questionário não encontrada.
 *       500:
 *         description: Erro ao apagar a resposta.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     QuestionnaireResponse:
 *       type: object
 *       properties:
 *         id_questionnaire_response:
 *           type: integer
 *           description: ID único da resposta do questionário.
 *         budget:
 *           type: number
 *           description: Orçamento do utilizador.
 *         verification:
 *           type: boolean
 *           description: Indica se a resposta foi verificada.
 *         salary:
 *           type: number
 *           description: Salário do utilizador.
 *         expenses:
 *           type: number
 *           description: Despesas do utilizador.
 *         available_amount:
 *           type: number
 *           description: Quantia disponível do utilizador.
 *         debt:
 *           type: number
 *           description: Dívida total do utilizador.
 *         debt_monthly:
 *           type: number
 *           description: Pagamento mensal da dívida.
 *         income_source:
 *           type: string
 *           description: Fonte de renda do utilizador.
 *         ref_id_user:
 *           type: integer
 *           description: ID do utilizador associado à resposta.
 *       required:
 *         - budget
 *         - verification
 *         - salary
 *         - expenses
 *         - available_amount
 *         - debt
 *         - debt_monthly
 *         - income_source
 *         - ref_id_user
 */
import express from "express";
import { QuestionnaireController } from "../controllers/questionnaireController";

const router = express.Router();
const questionnaireController = new QuestionnaireController();

// GET Questionnaire Routes
router.get("/", questionnaireController.getAllQuestionnaires); // Get all questionnaires
router.get("/:id", questionnaireController.getQuestionnaireById); // Get questionnaire by ID
router.get("/user/:userId", questionnaireController.getQuestionnaireByUserId); // Get questionnaires by user ID
router.get(
  "/verified/:userId",
  questionnaireController.getVerifiedQuestionnaires
); // Get verified questionnaires by user ID
router.get(
  "/unverified/:userId",
  questionnaireController.getUnverifiedQuestionnaires
); // Get unverified questionnaires by user ID
router.get(
  "/last/:userId",
  questionnaireController.getLastQuestionnaireResponse
); // Get last questionnaire response by user ID

// POST Questionnaire Routes
router.post("/", questionnaireController.createQuestionnaireResponse); // Create a new questionnaire response

// PUT Questionnaire Routes
router.put("/:id", questionnaireController.updateQuestionnaireResponse); // Update a specific questionnaire response by ID

// DELETE Questionnaire Routes
router.delete("/:id", questionnaireController.deleteQuestionnaireResponse); // Delete a specific questionnaire response by ID

export default router;
