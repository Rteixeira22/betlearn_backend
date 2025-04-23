/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Gestão de administradores
 */

/**
 * @swagger
 *
 * /admin:
 *   get:
 *     summary: Obtém todos os administradores
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: Lista de administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *       500:
 *         description: Erro ao buscar administradores
 */

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Obtém um administrador pelo ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do administrador
 *         example: 1
 *     responses:
 *       200:
 *         description: Dados do administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       404:
 *         description: Administrador não encontrado
 *       500:
 *         description: Erro ao buscar administrador
 */

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Cria um novo administrador
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             example:
 *               name: "Admin Name"
 *               email: "admin@example.com"
 *               username: "adminuser"
 *               password: "securepassword"
 *               image: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar administrador
 */

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: Atualiza um administrador existente
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do administrador
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *               name: "Admin Name"
 *               email: "admin@example.com"
 *               username: "adminuser"
 *               password: "securepassword"
 *               image: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Administrador atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Administrador não encontrado
 *       500:
 *         description: Erro ao atualizar administrador
 */

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Remove um administrador
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do administrador
 *         example: 1
 *     responses:
 *       204:
 *         description: Administrador removido com sucesso
 *       404:
 *         description: Administrador não encontrado
 *       500:
 *         description: Erro ao remover administrador
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do administrador
 *           example: 1
 *         name:
 *           type: string
 *           description: Nome do administrador
 *           example: "Admin Name"
 *         email:
 *           type: string
 *           description: Email do administrador
 *           example: "admin@example.com"
 *         username:
 *           type: string
 *           description: Nome de usuário do administrador
 *           example: "adminuser"
 *         password:
 *           type: string
 *           description: Senha do administrador
 *           example: "securepassword"
 *         image:
 *           type: string
 *           nullable: true
 *           description: URL da imagem do administrador
 *           example: "https://example.com/image.jpg"
 */

import express from "express";
import { AdminController } from "../controllers/adminController";

const router = express.Router();
const adminController = new AdminController();

// GET Admin Routes
router.get("/", adminController.getAdmins); // Get all admins
router.get("/:id", adminController.getAdminById); // Get admin by ID

// POST Admin Routes
router.post("/", adminController.createAdmin); // Create admin

// PUT Admin Routes
router.put("/:id", adminController.updateAdmin); // Update admin

// DELETE Admin Routes
router.delete("/:id", adminController.deleteAdmin); // Delete admin

export default router; // Export router
