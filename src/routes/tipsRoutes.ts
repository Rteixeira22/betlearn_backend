/**
 * @swagger
 * tags:
 *   name: Tips
 *   description: Gestão de dicas (tips)
 */

/**
 * @swagger
 * /tips:
 *   get:
 *     summary: Obtém todas as dicas.
 *     tags: [Tips]
 *     responses:
 *       200:
 *         description: Lista de dicas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tips'
 *       500:
 *         description: Erro ao buscar dicas.
 */

/**
 * @swagger
 * /tips/{id}:
 *   get:
 *     summary: Obtém uma dica pelo ID.
 *     tags: [Tips]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID da dica.
 *     responses:
 *       200:
 *         description: Dica encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tips'
 *       500:
 *         description: Erro ao buscar a dica.
 */
/**
 * @swagger
 * /tips/active:
 *   get:
 *     summary: Obtém a dica ativa.
 *     tags: [Tips]
 *     responses:
 *       200:
 *         description: Dica ativa encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tips'
 *       404:
 *         description: Nenhuma dica ativa encontrada.
 *       500:
 *         description: Erro ao buscar a dica ativa.
 */

/**
 * @swagger
 * /tips:
 *   post:
 *     summary: Cria uma nova dica.
 *     tags: [Tips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tip:
 *                 type: string
 *                 description: Conteúdo da dica.
 *             required:
 *               - tip
 *     responses:
 *       201:
 *         description: Dica criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tips'
 *       500:
 *         description: Erro ao criar a dica.
 */

/**
 * @swagger
 * /tips/{id}:
 *   put:
 *     summary: Atualiza uma dica pelo ID.
 *     tags: [Tips]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID da dica a ser atualizada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tip:
 *                 type: string
 *                 description: Novo conteúdo da dica.
 *             required:
 *               - tip
 *     responses:
 *       200:
 *         description: Dica atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tips'
 *       500:
 *         description: Erro ao atualizar a dica.
 */
/**
 * @swagger
 * /tips/{id}/state:
 *   put:
 *     summary: Atualiza o estado de uma dica pelo ID.
 *     tags: [Tips]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID da dica a ser atualizada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               active:
 *                 type: integer
 *                 description: Novo Estado.
 *             required:
 *               - active
 *     responses:
 *       200:
 *         description: Dica atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tips'
 *       500:
 *         description: Erro ao atualizar o estado da dica.
 */
/**
 * @swagger
 * /tips/{id}:
 *   delete:
 *     summary: Apaga uma dica pelo ID.
 *     tags: [Tips]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID da dica a ser deletada.
 *     responses:
 *       200:
 *         description: Dica deletada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tip deleted successfully"
 *       500:
 *         description: Erro ao deletar a dica.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tips:
 *       type: object
 *       properties:
 *         id_tip:
 *           type: integer
 *           description: ID único da dica.
 *         tip:
 *           type: string
 *           description: Conteúdo da dica.
 *         active:
 *           type: integer
 *           description: Estado da dica
 */
import express from "express";
import { TipsController } from "../controllers/tipsController";
import { requireAPIKey } from "../middleware/auth";
import { verifyJWT } from '../middleware/verifyJWT';
import authorize from '../middleware/authorize';

const router = express.Router();
const tipsController = new TipsController();

router.get("/active", requireAPIKey, tipsController.getActiveTip); // Get active tip

// GET Tip Routes
router.get("/", requireAPIKey, tipsController.getTips); // Get all tips
router.get("/:id", requireAPIKey, verifyJWT, tipsController.getTipById); // Get tip by ID

// POST Tip Routes
router.post("/", requireAPIKey, verifyJWT, authorize('admin'), tipsController.createTip); // Create tip

// Put Tip Routes
router.put("/:id", requireAPIKey, verifyJWT, authorize('admin'), tipsController.updateTip); // Update tip

// Put Tip State Routes
router.put("/:id/state", requireAPIKey, tipsController.updateTipState); // Update tip state

// DELETE Tip Routes
router.delete("/:id", requireAPIKey, verifyJWT, authorize('admin'), tipsController.deleteTip); // Delete tip

export default router; 
