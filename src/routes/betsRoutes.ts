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
 * /bets/pending/{userId}:
 *   get:
 *     summary: Obtém apostas pendentes prontas para processamento
 *     description: Retorna apostas pendentes que estão prontas para serem processadas (1.5h+ após o horário do jogo)
 *     tags: [Bets]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do Utilizador
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de apostas pendentes prontas para processamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_bets:
 *                         type: integer
 *                         description: ID da aposta
 *                         example: 1
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: Data da aposta
 *                         example: "2025-04-02T12:00:00Z"
 *                       amount:
 *                         type: number
 *                         description: Valor apostado
 *                         example: 100.50
 *                       potential_earning:
 *                         type: number
 *                         description: Ganho potencial
 *                         example: 200.00
 *                       state:
 *                         type: integer
 *                         description: Estado da aposta (0 para pendente)
 *                         example: 0
 *                       result:
 *                         type: integer
 *                         description: Resultado da aposta (0 para pendente)
 *                         example: 0
 *                       BetsHasGames:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             game:
 *                               type: object
 *                               properties:
 *                                 id_game:
 *                                   type: integer
 *                                   example: 10
 *                                 local_team:
 *                                   type: string
 *                                   example: "Team A"
 *                                 visitor_team:
 *                                   type: string
 *                                   example: "Team B"
 *                                 schedule:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2025-04-02T15:00:00Z"
 *                             championship:
 *                               type: object
 *                               properties:
 *                                 id_championship:
 *                                   type: integer
 *                                   example: 2
 *                                 name:
 *                                   type: string
 *                                   example: "Premier League"
 *                 message:
 *                   type: string
 *                   example: "5 aposta(s) pronta(s) para processamento"
 *       400:
 *         description: Formato de ID de utilizador inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Formato de ID de utilizador inválido"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Falha ao obter apostas pendentes"
 */

/**
 * @swagger
 * /bets/process-results/{userId}:
 *   post:
 *     summary: Processa resultados das apostas e atualiza saldo do utilizador
 *     description: Processa uma lista de apostas com seus resultados, atualizando o dinheiro e pontos do utilizador
 *     tags: [Bets]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do Utilizador
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               processedBets:
 *                 type: array
 *                 description: Array de apostas processadas com seus resultados
 *                 items:
 *                   type: object
 *                   properties:
 *                     betId:
 *                       type: integer
 *                       description: ID da aposta
 *                       example: 1
 *                     isWin:
 *                       type: boolean
 *                       description: Se a aposta foi ganha (true) ou perdida (false)
 *                       example: true
 *                   required:
 *                     - betId
 *                     - isWin
 *             example:
 *               processedBets:
 *                 - betId: 1
 *                   isWin: true
 *                 - betId: 2
 *                   isWin: false
 *                 - betId: 3
 *                   isWin: true
 *     responses:
 *       200:
 *         description: Resultados das apostas processados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     processedBets:
 *                       type: integer
 *                       description: Número de apostas processadas
 *                       example: 3
 *                     totalWinnings:
 *                       type: number
 *                       description: Total de ganhos das apostas vencedoras
 *                       example: 350.75
 *                     pointsLost:
 *                       type: integer
 *                       description: Total de pontos perdidos (50 por aposta perdida)
 *                       example: 50
 *                     newBalance:
 *                       type: object
 *                       description: Novo saldo do utilizador
 *                       properties:
 *                         money:
 *                           type: number
 *                           description: Novo saldo em dinheiro
 *                           example: 1350.75
 *                         points:
 *                           type: integer
 *                           description: Novos pontos do utilizador
 *                           example: 950
 *                 message:
 *                   type: string
 *                   example: "Resultados das apostas processados com sucesso"
 *       400:
 *         description: Dados inválidos fornecidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     invalidUserId:
 *                       value: "Formato de ID de utilizador inválido"
 *                     missingBets:
 *                       value: "Array de apostas processadas é obrigatório"
 *       404:
 *         description: Utilizador não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Utilizador não encontrado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Falha ao processar resultados das apostas"
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
import { requireAPIKey } from "../middleware/auth";
import { verifyJWT } from '../middleware/verifyJWT';

const router = express.Router();
const betsController = new BetsController();

// GET Bet Routes
/* router.get("/:id/bets/active", betsController.getActiveUserBets); // Get active user bets
router.get("/:id/bets/concluded", betsController.getConcludedUserBets); // Get concluded user bets
router.get("/:id/bets/winning", betsController.getWinningUserBets); // Get winning user bets
router.get("/:id/bets/losing", betsController.getLosingUserBets); */ // Get losing user bets
router.get("/last/:id", requireAPIKey, betsController.getLastUserBets); // Get last bet by user ID
router.get("/count-today", requireAPIKey, betsController.getBetsByDate); // Get count of today's bets
router.get("/count/:id", requireAPIKey, betsController.countUserBetsById); // Get count of bets by user ID
router.get("/:id", requireAPIKey, verifyJWT, betsController.getBetsByUserId); // Get bets by user ID

router.get("/pending/:userId", requireAPIKey, verifyJWT, betsController.getPendingBetsForProcessing); // Get bets ready for processing

router.post("/process-results/:userId", requireAPIKey, verifyJWT, betsController.processBetResults); // Process bet results and update user
// POST Bet Routes
router.post("/:id_user/:id_championship", requireAPIKey, verifyJWT, betsController.createBet); // Create a new bet

// Update Bet Routes
router.patch("/:id", requireAPIKey, verifyJWT, betsController.updateBet); // Update a bet by ID

// Delete Bet Routes
router.delete("/:id", requireAPIKey, verifyJWT, betsController.deleteBet); // Delete a bet by ID

export default router;
