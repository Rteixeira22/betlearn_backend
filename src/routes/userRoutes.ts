/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestão de utilizadores no sistema
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtém todos os utilizadores.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de utilizadores.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 *       500:
 *         description: Erro ao buscar utilizadores.
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtém um utilizador pelo ID.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     responses:
 *       200:
 *         description: Utilizador encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       500:
 *         description: Erro ao buscar o utilizador.
 */

/**
 * @swagger
 * /users/{id}/challenges:
 *   get:
 *     summary: Obtém os desafios de um utilizador.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     responses:
 *       200:
 *         description: Lista de desafios do utilizador.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 *       500:
 *         description: Erro ao buscar desafios do utilizador.
 */

/**
 * @swagger
 * /users/{id}/bets:
 *   get:
 *     summary: Obtém o histórico de apostas de um utilizador.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     responses:
 *       200:
 *         description: Histórico de apostas do utilizador.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bet'
 *       500:
 *         description: Erro ao buscar histórico de apostas.
 */

/**
 * @swagger
 * /users/{id}/bets/active:
 *   get:
 *     summary: Obtém as apostas ativas de um utilizador.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     responses:
 *       200:
 *         description: Lista de apostas ativas do utilizador.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bet'
 *       500:
 *         description: Erro ao buscar apostas ativas.
 */

/**
 * @swagger
 * /users/{id}/bets/closed:
 *   get:
 *     summary: Obtém as apostas fechadas de um utilizador.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     responses:
 *       200:
 *         description: Lista de apostas fechadas do utilizador.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bet'
 *       500:
 *         description: Erro ao buscar apostas fechadas.
 */

/**
 * @swagger
 * /users/{id}/bets/won:
 *   get:
 *     summary: Obtém as apostas ganhas de um utilizador.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     responses:
 *       200:
 *         description: Lista de apostas ganhas do utilizador.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bet'
 *       500:
 *         description: Erro ao buscar apostas ganhas.
 */

/**
 * @swagger
 * /users/{id}/bets/lost:
 *   get:
 *     summary: Obtém as apostas perdidas de um utilizador.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     responses:
 *       200:
 *         description: Lista de apostas perdidas do utilizador.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bet'
 *       500:
 *         description: Erro ao buscar apostas perdidas.
 */
/**
 * @swagger
 * /users/username/{username}:
 *   get:
 *     summary: Obtém um utilizador pelo nome de utilizador (username).
 *     tags: [Users]
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "john_doe"
 *         description: Nome de utilizador.
 *     responses:
 *       200:
 *         description: Utilizador encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: Utilizador não encontrado.
 *       500:
 *         description: Erro ao buscar o utilizador.
 */

/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Obtém um utilizador pelo email.
 *     tags: [Users]
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "john.doe@example.com"
 *         description: Email do utilizador.
 *     responses:
 *       200:
 *         description: Utilizador encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: Utilizador não encontrado.
 *       500:
 *         description: Erro ao buscar o utilizador.
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo utilizador.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do utilizador.
 *               email:
 *                 type: string
 *                 description: Email do utilizador.
 *               username:
 *                 type: string
 *                 description: Nome de utilizador.
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: Data de nascimento do utilizador.
 *               password:
 *                 type: string
 *                 description: Senha do utilizador.
 *               image:
 *                 type: string
 *                 description: URL da imagem do utilizador.
 *               money:
 *                 type: number
 *                 description: Quantidade de dinheiro do utilizador.
 *               points:
 *                 type: number
 *                 description: Pontos do utilizador.
 *               tutorial_verification:
 *                 type: boolean
 *                 description: Verificação do tutorial.
 *             required:
 *               - name
 *               - email
 *               - username
 *               - birthdate
 *               - password
 *     responses:
 *       201:
 *         description: Utilizador criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       500:
 *         description: Erro ao criar o utilizador.
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um utilizador pelo ID.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     responses:
 *       204:
 *         description: Utilizador deletado com sucesso.
 *       500:
 *         description: Erro ao deletar o utilizador.
 */
/**
 * @swagger
 * /users/{id}/password:
 *   patch:
 *     summary: Atualiza a senha de um utilizador.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Nova senha do utilizador (mínimo 8 caracteres).
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: ID inválido ou senha inválida.
 *       404:
 *         description: Utilizador não encontrado.
 *       500:
 *         description: Erro ao atualizar a senha.
 */

/**
 * @swagger
 * /users/{id}/profile:
 *   patch:
 *     summary: Atualiza o perfil de um utilizador.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do utilizador.
 *               email:
 *                 type: string
 *                 description: Email do utilizador.
 *               username:
 *                 type: string
 *                 description: Nome de utilizador.
 *               image:
 *                 type: string
 *                 description: URL da imagem do utilizador.
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       500:
 *         description: Erro ao atualizar o perfil.
 */

/**
 * @swagger
 * /users/{id}/money:
 *   patch:
 *     summary: Atualiza o saldo de dinheiro de um utilizador.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               money:
 *                 type: number
 *                 description: Novo saldo de dinheiro do utilizador.
 *             required:
 *               - money
 *     responses:
 *       200:
 *         description: Saldo atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       500:
 *         description: Erro ao atualizar o saldo.
 */

/**
 * @swagger
 * /users/{id}/points:
 *   patch:
 *     summary: Atualiza os pontos de um utilizador.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               points:
 *                 type: number
 *                 description: Nova pontuação do utilizador.
 *             required:
 *               - points
 *     responses:
 *       200:
 *         description: Pontos atualizados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       500:
 *         description: Erro ao atualizar os pontos.
 */

/**
 * @swagger
 * /users/{id}/bets-visibility:
 *   patch:
 *     summary: Atualiza a visibilidade das apostas de um utilizador.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bets_visibility:
 *                 type: boolean
 *                 description: Nova configuração de visibilidade das apostas.
 *             required:
 *               - bets_visibility
 *     responses:
 *       200:
 *         description: Visibilidade das apostas atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       500:
 *         description: Erro ao atualizar a visibilidade das apostas.
 */

/**
 * @swagger
 * /users/{id}/tutorial-verification:
 *   patch:
 *     summary: Atualiza a verificação do tutorial de um utilizador.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID do utilizador.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tutorial_verification:
 *                 type: boolean
 *                 description: Nova configuração de verificação do tutorial.
 *             required:
 *               - tutorial_verification
 *     responses:
 *       200:
 *         description: Verificação do tutorial atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       500:
 *         description: Erro ao atualizar a verificação do tutorial.
 */

/**
 * @swagger
 * /users/classification/all:
 *   get:
 *     summary: Obtém o ranking de utilizadores ordenado por pontos.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Ranking de utilizadores obtido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 *       500:
 *         description: Erro ao buscar o ranking.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       properties:
 *         id_user:
 *           type: integer
 *           description: ID único do utilizador.
 *         name:
 *           type: string
 *           description: Nome do utilizador.
 *         email:
 *           type: string
 *           description: Email do utilizador.
 *         username:
 *           type: string
 *           description: Nome de utilizador.
 *         birthdate:
 *           type: string
 *           format: date
 *           description: Data de nascimento do utilizador.
 *         image:
 *           type: string
 *           description: URL da imagem do utilizador.
 *         money:
 *           type: number
 *           description: Quantidade de dinheiro do utilizador.
 *         points:
 *           type: number
 *           description: Pontos do utilizador.
 *         tutorial_verification:
 *           type: boolean
 *           description: Verificação do tutorial.
 */
import express from "express";
import { UserController } from "../controllers/userController";

const router = express.Router();
const userController = new UserController();

// USER ROUTES

// Get all users
router.get("/", userController.getAllusers);

// User Profile Routes
router.get("/:id", userController.getUserById);
router.get("/username/:username", userController.getUserByUsername);
router.get("/email/:email", userController.getUserByEmail);

// User Profile Update Routes

router.patch("/:id/password", userController.updateUserPassword);
router.patch("/:id/profile", userController.updateUserProfile);
//esta como string
router.patch("/:id/money", userController.updateUserMoney);
router.patch("/:id/points", userController.updateUserPoints);
router.patch("/:id/bets-visibility", userController.updateUserBetsVisibility);
router.patch(
  "/:id/tutorial-verification",
  userController.updateUserTutorialVerification
);

// User management routes
router.post("/", userController.createUser); //aqui ele tem de levar todos os parametros porque nenhum esta default  - garantir que username, email não existem no frontend, para nao dar erro
router.delete("/:id", userController.deleteUser);

//CHALLENGES ROUTES

router.get("/:id/challenges", userController.getUserChallenges);

// Bet Routes
router.get("/:id/bets", userController.getUserBetHistory);
router.get("/:id/bets/active", userController.getActiveBets);
router.get("/:id/bets/closed", userController.getClosedBets);
router.get("/:id/bets/won", userController.getWonBets);
router.get("/:id/bets/lost", userController.getLostBets);

// Leaderboard
router.get("/classification/all", userController.getLeaderboard); // fiz com all no final para nao entrar noutra rota, ja que isto devia ter outro controlador e outro ficheiro de rotas

export default router;
