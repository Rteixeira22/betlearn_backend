/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Gestão de autenticação
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login de um utilizador na plataforma
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Authentication'
 *     responses:
 *       200:
 *         description: Utilizador autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     image:
 *                       type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Falha na autenticação
 */

/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Realiza o login de um administrador na plataforma
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Authentication'
 *     responses:
 *       200:
 *         description: Administrador autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id_user:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     birthdate:
 *                       type: string
 *                       format: date-time
 *                     money:
 *                       type: string
 *                     points:
 *                       type: integer
 *                     image:
 *                       type: string
 *                     bets_visibility:
 *                       type: boolean
 *                     tutorial_verification:
 *                       type: boolean
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Falha na autenticação
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Authentication:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Nome de utilizador
 *           example: user123
 *         password:
 *           type: string
 *           description: Senha do utilizador
 *           example: password123
 */

import express from "express";
import { AuthController } from "../controllers/authController";

const router = express.Router();
const authController = new AuthController();

// Authentication Routes
router.post("/login", authController.login); // Login route

// Autentication Admin Routes
router.post("/admin/login", authController.adminLogin); // Admin login route

export default router;
