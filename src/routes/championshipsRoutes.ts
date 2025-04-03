/**
 * @swagger
 * tags:
 *   name: Championships
 *   description: Gestão de campeonatos
 */
/**
 * @swagger
 * /championships:
 *   get:
 *     summary: Obtém todos os campeonatos
 *     tags: [Championships]
 *     responses:
 *       200:
 *         description: Lista de todos os campeonatos
 *         content:
 *           application/json:
 *             example:
 *               - id_championship: 1
 *                 json: "{...}"
 *               - id_championship: 2
 *                 json: "{...}"
 *       500:
 *         description: Erro ao procurar todos os campeonatos
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao procurar todos os campeonatos."
 */

/**
 * @swagger
 * /championships/{id}:
 *   get:
 *     summary: Obtém um campeonato pelo ID
 *     tags: [Championships]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do campeonato
 *         example: 1
 *     responses:
 *       200:
 *         description: Dados do campeonato
 *         content:
 *           application/json:
 *             example:
 *               id_championship: 1
 *               json: "{...}"
 *       500:
 *         description: Erro ao procurar campeonato
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao procurar campeonato."
 */

/**
 * @swagger
 * /championships:
 *   post:
 *     summary: Cria um novo campeonato
 *     tags: [Championships]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               json:
 *                 type: string
 *                 description: Dados do campeonato em formato JSON
 *                 example: "{...}"
 *     responses:
 *       200:
 *         description: Campeonato criado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id_championship: 1
 *               json: "{...}"
 *       500:
 *         description: Erro ao criar campeonato
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao criar campeonato."
 */

/**
 * @swagger
 * /championships/{id}:
 *   put:
 *     summary: Atualiza um campeonato existente
 *     tags: [Championships]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do campeonato
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               json:
 *                 type: string
 *                 description: Novos dados do campeonato em formato JSON
 *                 example: "{...}"
 *     responses:
 *       200:
 *         description: Campeonato atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id_championship: 1
 *               json: "{...}"
 *       500:
 *         description: Erro ao atualizar campeonato
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao atualizar campeonato."
 */

/**
 * @swagger
 * /championships/{id}:
 *   delete:
 *     summary: Apaga um campeonato pelo ID
 *     tags: [Championships]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do campeonato
 *         example: 1
 *     responses:
 *       200:
 *         description: Campeonato apagado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id_championship: 1
 *               json: "{...}"
 *       500:
 *         description: Erro ao apagar campeonato
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao apagar campeonato."
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Championships:
 *       type: object
 *       properties:
 *         id_championship:
 *           type: integer
 *           description: ID único do campeonato
 *           example: 1
 *         json:
 *           type: string
 *           description: Dados do campeonato em formato JSON
 *           example: "{...}"
 */
import express from "express";
import { ChampionsController } from "../controllers/championshipsController";

const router = express.Router();
const championsController = new ChampionsController();

//GETS
//TODOS
router.get("/", championsController.getAllChampionships);

//UM
router.get("/:id", championsController.getChampionshipById);

//POST
router.post("/", championsController.createChampionship);

//UPDATE
router.put("/:id", championsController.updateChampionship);

//DELETE
router.delete("/:id", championsController.deleteChampionship);

export default router;
