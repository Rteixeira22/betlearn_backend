/**
 * @swagger
 * tags:
 *   name: Admin Notification
 *   description: Gestão de notificações para administradores
 */

import express from "express"; 
import { AdminNotificationController } from "../controllers/adminNotificationController"; // Import the controller

const router = express.Router(); 
const adminNotificationController = new AdminNotificationController(); // Create an instance of the controller

router.get("/", adminNotificationController.getNotifications); // Route to get all notifications

router.get("/:id", adminNotificationController.getNotificationById); // Route to get notification by ID

router.post("/", adminNotificationController.createNotification); // Route to create a new notification

router.put("/:id", adminNotificationController.updateNotification); // Route to update a notification by ID

router.delete("/:id", adminNotificationController.deleteNotification); // Route to delete a notification by ID

export default router; // Export router
