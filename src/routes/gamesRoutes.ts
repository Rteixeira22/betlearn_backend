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
import express from "express";
import { GamesController } from "../controllers/gamesController";

const router = express.Router();
const gamesController = new GamesController();

//GETS
//TODOS
router.get("/", gamesController.getAllGames);
//UM
router.get("/:id", gamesController.getGameById);

//POST
router.post("/", gamesController.createGame);

//UPDATE
router.put("/:id/:betId", gamesController.updateGameState);

//DELETE
router.delete("/:id", gamesController.deleteGame);

export default router;
