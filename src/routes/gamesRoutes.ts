/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Gestão de jogos
 */
/**
 * @swagger
 * /games:
 *   get:
 *     summary: Obtém todos os jogos
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: Lista de todos os jogos
 *         content:
 *           application/json:
 *             example:
 *               - id_game: 1
 *                 local_team: "Team A"
 *                 visitor_team: "Team B"
 *                 schedule: "2025-04-03T15:00:00.000Z"
 *                 betted_team: "Team A"
 *                 odd: 1.5
 *                 goals_local_team: 2
 *                 goals_visitor_team: 1
 *                 image: "image_url"
 *                 game_state: 0
 *       500:
 *         description: Erro ao procurar todos os jogos
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao procurar todos os jogos."
 */

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Obtém um jogo pelo ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do jogo
 *         example: 1
 *     responses:
 *       200:
 *         description: Dados do jogo
 *         content:
 *           application/json:
 *             example:
 *               id_game: 1
 *               local_team: "Team A"
 *               visitor_team: "Team B"
 *               schedule: "2025-04-03T15:00:00.000Z"
 *               betted_team: "Team A"
 *               odd: 1.5
 *               goals_local_team: 2
 *               goals_visitor_team: 1
 *               image: "image_url"
 *               game_state: 0
 *       500:
 *         description: Erro ao procurar o jogo
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao procurar o jogo."
 */

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Cria um novo jogo
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               local_team:
 *                 type: string
 *                 description: Nome da equipa local
 *                 example: "Team A"
 *               visitor_team:
 *                 type: string
 *                 description: Nome da equipa visitante
 *                 example: "Team B"
 *               schedule:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora do jogo
 *                 example: "2025-04-03T15:00:00.000Z"
 *               betted_team:
 *                 type: string
 *                 description: Equipa apostada
 *                 example: "Team A"
 *               odd:
 *                 type: number
 *                 description: Odd do jogo
 *                 example: 1.5
 *               goals_local_team:
 *                 type: integer
 *                 description: Golos da equipa local
 *                 example: 2
 *               goals_visitor_team:
 *                 type: integer
 *                 description: Golos da equipa visitante
 *                 example: 1
 *               image:
 *                 type: string
 *                 description: URL da imagem do jogo
 *                 example: "image_url"
 *               game_state:
 *                 type: integer
 *                 description: Estado do jogo (0 = ativo, 1 = concluído)
 *                 example: 0
 *     responses:
 *       200:
 *         description: Jogo criado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id_game: 1
 *               local_team: "Team A"
 *               visitor_team: "Team B"
 *               schedule: "2025-04-03T15:00:00.000Z"
 *               betted_team: "Team A"
 *               odd: 1.5
 *               goals_local_team: 2
 *               goals_visitor_team: 1
 *               image: "image_url"
 *               game_state: 0
 *       500:
 *         description: Erro ao criar o jogo
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao criar o jogo."
 */

/**
 * @swagger
 * /games/{id}/{betId}:
 *   put:
 *     summary: Atualiza o estado de um jogo
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do jogo
 *         example: 1
 *       - in: path
 *         name: betId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da aposta associada
 *         example: 1
 *     responses:
 *       200:
 *         description: Estado do jogo atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               updatedSingleGame:
 *                 id_game: 1
 *                 game_state: 1
 *               updatedBet:
 *                 id_bets: 1
 *                 state: 1
 *       500:
 *         description: Erro ao atualizar o estado do jogo
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao atualizar o estado do jogo."
 */

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     summary: Apaga um jogo pelo ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do jogo
 *         example: 1
 *     responses:
 *       200:
 *         description: Jogo apagado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id_game: 1
 *               local_team: "Team A"
 *               visitor_team: "Team B"
 *               schedule: "2025-04-03T15:00:00.000Z"
 *               betted_team: "Team A"
 *               odd: 1.5
 *               goals_local_team: 2
 *               goals_visitor_team: 1
 *               image: "image_url"
 *               game_state: 0
 *       500:
 *         description: Erro ao apagar o jogo
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao apagar o jogo."
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Games:
 *       type: object
 *       properties:
 *         id_game:
 *           type: integer
 *           description: ID único do jogo
 *           example: 1
 *         local_team:
 *           type: string
 *           description: Nome da equipa local
 *           example: "Team A"
 *         visitor_team:
 *           type: string
 *           description: Nome da equipa visitante
 *           example: "Team B"
 *         schedule:
 *           type: string
 *           format: date-time
 *           description: Data e hora do jogo
 *           example: "2025-04-03T15:00:00.000Z"
 *         betted_team:
 *           type: string
 *           description: Equipa apostada
 *           example: "Team A"
 *         odd:
 *           type: number
 *           description: Odd do jogo
 *           example: 1.5
 *         goals_local_team:
 *           type: integer
 *           description: Golos da equipa local
 *           example: 2
 *         goals_visitor_team:
 *           type: integer
 *           description: Golos da equipa visitante
 *           example: 1
 *         image:
 *           type: string
 *           description: URL da imagem do jogo
 *           example: "image_url"
 *         game_state:
 *           type: integer
 *           description: Estado do jogo (0 = ativo, 1 = concluído)
 *           example: 0
 */

/**
 * @swagger
 * /games/most-betted-today:
 *   get:
 *     summary: Obtém o jogo mais apostado do dia atual
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: Jogo mais apostado do dia atual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *                   example: "Jogo mais apostado do dia recuperado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_game:
 *                       type: integer
 *                       description: ID único do jogo
 *                       example: 1
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
 *                       example: "2025-04-03T15:00:00.000Z"
 *                     betted_team:
 *                       type: string
 *                       description: Equipa apostada
 *                       example: "Team A"
 *                     odd:
 *                       type: number
 *                       description: Odd do jogo
 *                       example: 1.5
 *                     goals_local_team:
 *                       type: integer
 *                       description: Golos da equipa local
 *                       example: 2
 *                     goals_visitor_team:
 *                       type: integer
 *                       description: Golos da equipa visitante
 *                       example: 1
 *                     image:
 *                       type: string
 *                       description: URL da imagem do jogo
 *                       example: "image_url"
 *                     game_state:
 *                       type: integer
 *                       description: Estado do jogo (0 = ativo, 1 = concluído)
 *                       example: 0
 *                     bet_count:
 *                       type: integer
 *                       description: Número de apostas feitas neste jogo
 *                       example: 5
 *                     championship_json:
 *                       type: object
 *                       description: Informações do campeonato em formato JSON
 *                       example: {
 *                         "name": "Premier League",
 *                         "country": "England",
 *                         "season": "2024/2025"
 *                       }
 *       404:
 *         description: Não foram encontradas apostas para o dia atual
 *         content:
 *           application/json:
 *             example:
 *               message: "Não foram encontradas apostas para hoje."
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             example:
 *               message: "Erro interno do servidor ao procurar o jogo mais apostado"
 */



import express from "express";
import { GamesController } from "../controllers/gamesController";

import { requireAPIKey } from "../middleware/auth";
import { verifyJWT } from '../middleware/verifyJWT';
import authorize from '../middleware/authorize';

const router = express.Router();
const gamesController = new GamesController();

//GETS
//TODOS
router.get("/", requireAPIKey, verifyJWT, gamesController.getAllGames);
//Jodo do dia
router.get("/most-betted-today", requireAPIKey, verifyJWT, authorize('admin'), gamesController.getMostBettedGameOfDay);
//UM
router.get("/:id", requireAPIKey, verifyJWT, gamesController.getGameById);


//POST
router.post("/", requireAPIKey, verifyJWT, gamesController.createGame);

//UPDATE
router.put("/:id/:betId", requireAPIKey, verifyJWT, gamesController.updateGameState);

//DELETE
router.delete("/:id", requireAPIKey, verifyJWT, gamesController.deleteGame);

export default router;
