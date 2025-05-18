/**
 * @swagger
 * tags:
 *   name: Admin Notification
 *   description: Gestão de notificações para administradores
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminNotification:
 *       type: object
 *       required:
 *         - title
 *         - message
 *         - type
 *         - source
 *       properties:
 *         id_notification:
 *           type: integer
 *           description: ID único da notificação
 *         title:
 *           type: string
 *           description: Título da notificação
 *         message:
 *           type: string
 *           description: Conteúdo da mensagem da notificação
 *         source:
 *           type: string
 *           description: Origem da notificação
 *         type:
 *           type: string
 *           description: Tipo da notificação
 *         is_read:
 *           type: boolean
 *           description: Indica se a notificação foi lida
 *           default: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data e hora de criação da notificação
 *       example:
 *         id_notification: 1
 *         title: Nova atualização do sistema
 *         message: O sistema foi atualizado com novos recursos
 *         source: system
 *         type: info
 *         is_read: false
 *         created_at: 2023-04-15T14:30:00Z
 * 
 * /api/admin/notifications:
 *   get:
 *     summary: Recupera todas as notificações
 *     description: Retorna uma lista de todas as notificações para administradores, com opção de filtrar por status de leitura
 *     tags: [Admin Notification]
 *     parameters:
 *       - in: query
 *         name: is_read
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrar por notificações lidas ou não lidas
 *     responses:
 *       200:
 *         description: Lista de notificações recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminNotification'
 *       500:
 *         description: Erro ao buscar notificações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch notifications
 * 
 *   post:
 *     summary: Cria uma nova notificação
 *     description: Adiciona uma nova notificação ao sistema
 *     tags: [Admin Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - type
 *               - source
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título da notificação
 *               message:
 *                 type: string
 *                 description: Conteúdo da mensagem da notificação
 *               type:
 *                 type: string
 *                 description: Tipo da notificação (ex. info, warning, error)
 *               source:
 *                 type: string
 *                 description: Origem da notificação
 *             example:
 *               title: Nova atualização do sistema
 *               message: O sistema foi atualizado com novos recursos
 *               type: info
 *               source: system
 *     responses:
 *       200:
 *         description: Notificação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminNotification'
 *       500:
 *         description: Erro ao criar notificação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to create notification
 * 
 * /api/admin/notifications/{id}:
 *   get:
 *     summary: Recupera uma notificação específica
 *     description: Retorna os detalhes de uma notificação com base no ID fornecido
 *     tags: [Admin Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único da notificação
 *     responses:
 *       200:
 *         description: Detalhes da notificação recuperados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminNotification'
 *       404:
 *         description: Notificação não encontrada
 *       500:
 *         description: Erro ao buscar notificação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch notification
 * 
 *   put:
 *     summary: Atualiza uma notificação
 *     description: Atualiza os detalhes de uma notificação existente com base no ID fornecido
 *     tags: [Admin Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único da notificação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título da notificação
 *               message:
 *                 type: string
 *                 description: Conteúdo da mensagem da notificação
 *               is_read:
 *                 type: boolean
 *                 description: Status de leitura da notificação
 *             example:
 *               title: Título atualizado
 *               message: Mensagem atualizada
 *               is_read: true
 *     responses:
 *       200:
 *         description: Notificação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminNotification'
 *       404:
 *         description: Notificação não encontrada
 *       500:
 *         description: Erro ao atualizar notificação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update notification
 * 
 *   delete:
 *     summary: Remove uma notificação
 *     description: Exclui uma notificação com base no ID fornecido
 *     tags: [Admin Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único da notificação
 *     responses:
 *       204:
 *         description: Notificação excluída com sucesso
 *       404:
 *         description: Notificação não encontrada
 *       500:
 *         description: Erro ao excluir notificação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to delete notification
 * 
 * /api/admin/notifications/{id}/read:
 *   put:
 *     summary: Marca uma notificação como lida
 *     description: Atualiza o status de uma notificação para lida
 *     tags: [Admin Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único da notificação
 *     responses:
 *       200:
 *         description: Notificação marcada como lida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminNotification'
 *       404:
 *         description: Notificação não encontrada
 *       500:
 *         description: Erro ao marcar notificação como lida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to mark notification as read
 */

import express from "express"; 
import { AdminNotificationController } from "../controllers/adminNotificationController"; // Import the controller

const router = express.Router(); 
const adminNotificationController = new AdminNotificationController(); // Create an instance of the controller

router.get("/", adminNotificationController.getNotifications); // Route to get all notifications

router.get("/:id", adminNotificationController.getNotificationById); // Route to get notification by ID

router.post("/", adminNotificationController.createNotification); // Route to create a new notification

router.put("/:id", adminNotificationController.updateNotification); // Route to update a notification by ID

router.put("/:id/read", adminNotificationController.markAsRead) // Route to mark a notification as read

router.delete("/:id", adminNotificationController.deleteNotification); // Route to delete a notification by ID

export default router; // Export router
