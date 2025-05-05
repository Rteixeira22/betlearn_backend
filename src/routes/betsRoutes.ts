/**
 * @swagger
 * tags:
 *   name: Bets
 *   description: Gestão de apostas
 */

/**
 * @swagger
 * /bets/{id}:
 *   get:
 *     summary: Obtém todas as apostas de um Utilizador
 *     tags: [Bets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do Utilizador
 *         example: 1
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: ['0', '1']
 *         required: false
 *         description: Filtrar por estado da aposta (0 para ativa, 1 para concluída)
 *         example: '1'
 *       - in: query
 *         name: result
 *         schema:
 *           type: string
 *           enum: ['0', '1']
 *         required: false
 *         description: Filtrar por resultado da aposta (1 para vitória, 0 para derrota)
 *         example: '1'
 *     responses:
 *       200:
 *         description: Lista de apostas do Utilizador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bets'
 *       500:
 *         description: Erro ao procurar apostas
 */

/**
 * @swagger
 * /bets/count/{id}:
 *   get:
 *     summary: Conta o número de apostas de um Utilizador
 *     tags: [Bets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do Utilizador
 *         example: 1
 *     responses:
 *       200:
 *         description: Número de apostas do Utilizador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Erro ao contar apostas
 */

/**
 * @swagger
 * /bets/count/{id}:
 *   get:
 *     summary: Conta o número de apostas de um Utilizador
 *     tags: [Bets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do Utilizador
 *         example: 1
 *     responses:
 *       200:
 *         description: Número de apostas do Utilizador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Erro ao contar apostas
 */

/**
 * @swagger
 * /bets/last/{id}:
 *   get:
 *     summary: Obtém a última aposta de um Utilizador
 *     tags: [Bets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do Utilizador
 *         example: 1
 *     responses:
 *       200:
 *         description: Última aposta do Utilizador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bets'
 *       500:
 *         description: Erro ao buscar a última aposta
 */

/**
 * @swagger
 * /bets/{id_user}/{id_championship}:
 *   post:
 *     summary: Cria uma nova aposta para um Utilizador
 *     tags: [Bets]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do Utilizador
 *         example: 1
 *       - in: path
 *         name: id_championship
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do Campeonato
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 : Valor apostado
 *                 example: 100.50
 *               potential_earning:
 *                 type: number
 *                 example: 200.00
 *               odd_bet:
 *                 type: number
 *                 example: 2.0
 *               ref:
 *                 type: integer
 *                 example: 123
 *               state:
 *                 type: integer
 *                 example: 0
 *               result:
 *                 type: integer
 *                 example: 1
 *               local_team:
 *                 type: string
 *                 example: "Team A"
 *               visitor_team:
 *                 type: string
 *                 example: "Team B"
 *               schedule:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-02T15:00:00Z"
 *               betted_team:
 *                 type: string
 *                 example: "Team A"
 *               odd_game:
 *                 type: number
 *                 example: 1.8
 *               goals_local_team:
 *                 type: integer
 *                 example: 2
 *               goals_visitor_team:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 nullable: true
 *                 example: "https://example.com/game-image.jpg"
 *               game_state:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       201:
 *         description: Aposta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bet:
 *                   $ref: '#/components/schemas/Bets'
 *                 game:
 *                   type: object
 *                   description: Dados do jogo criado
 *                   properties:
 *                     id_game:
 *                       type: integer
 *                       description: ID do jogo
 *                       example: 10
 *                     local_team:
 *                       type: string
 *                       description: Nome da equipa local
 *                       example: "Team A"
 *                     visitor_team:
 *                       type: string
 *                       description: Nome da equipa visitante
 *                       example: "Team B"
 *                     schedule:
 *                       type: string
 *                       format: date-time
 *                       description: Data e hora do jogo
 *                       example: "2025-04-02T15:00:00Z"
 *                 betsHasGames:
 *                   type: object
 *                   description: Relação entre aposta, jogo e campeonato
 *                   properties:
 *                     ref_id_game:
 *                       type: integer
 *                       description: ID do jogo
 *                       example: 10
 *                     ref_id_bet:
 *                       type: integer
 *                       description: ID da aposta
 *                       example: 5
 *                     ref_id_championship:
 *                       type: integer
 *                       description: ID do campeonato
 *                       example: 2
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar aposta
 */

/**
 * @swagger
 * /bets/{id}:
 *   patch:
 *     summary: Atualiza aposta por id (Estados)
 *     tags: [Bets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da aposta
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: integer
 *                 example: 1
 *               result:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Aposta atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bets'
 *       500:
 *         description: Erro ao atualizar aposta
 */

/**
 * @swagger
 * /bets/{id}:
 *   delete:
 *     summary: Remove uma aposta pelo ID
 *     tags: [Bets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da aposta
 *         example: 1
 *     responses:
 *       200:
 *         description: Aposta removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bets'
 *       500:
 *         description: Erro ao remover aposta
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Bets:
 *       type: object
 *       properties:
 *         id_bets:
 *           type: integer
 *           description: ID da aposta
 *           example: 1
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data da aposta
 *           example: "2025-04-02T12:00:00Z"
 *         type:
 *           type: integer
 *           description: Tipo da aposta
 *           example: 1
 *         amount:
 *           type: number
 *           description: Valor apostado
 *           example: 100.50
 *         potential_earning:
 *           type: number
 *           description: Ganho potencial
 *           example: 200.00
 *         odd:
 *           type: number
 *           description: Odd da aposta
 *           example: 2.0
 *         ref:
 *           type: integer
 *           description: Referência da aposta
 *           example: 123
 *         state:
 *           type: integer
 *           description: Estado da aposta (0 para ativa, 1 para concluída)
 *           example: 0
 *         result:
 *           type: integer
 *           description: Resultado da aposta (1 para vitória, 0 para derrota)
 *           example: 1
 *         ref_id_user:
 *           type: integer
 *           description: ID do Utilizador associado à aposta
 *           example: 1
 */

import express from "express";
import { BetsController } from "../controllers/betsController";

const router = express.Router();
const betsController = new BetsController();

// GET Bet Routes
/* router.get("/:id/bets/active", betsController.getActiveUserBets); // Get active user bets
router.get("/:id/bets/concluded", betsController.getConcludedUserBets); // Get concluded user bets
router.get("/:id/bets/winning", betsController.getWinningUserBets); // Get winning user bets
router.get("/:id/bets/losing", betsController.getLosingUserBets); */ // Get losing user bets
router.get("/last/:id", betsController.getLastUserBets); // Get last bet by user ID
router.get("/count-today", betsController.getBetsByDate); // Get count of today's bets
router.get("/count/:id", betsController.countUserBetsById); // Get count of bets by user ID
router.get("/:id", betsController.getBetsByUserId); // Get bets by user ID

// POST Bet Routes
router.post("/:id_user/:id_championship", betsController.createBet); // Create a new bet

// Update Bet Routes
router.patch("/:id", betsController.updateBet); // Update a bet by ID

// Delete Bet Routes
router.delete("/:id", betsController.deleteBet); // Delete a bet by ID

export default router;
