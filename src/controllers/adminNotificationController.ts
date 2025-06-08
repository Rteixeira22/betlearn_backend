import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { 
  ResponseHelper, 
  AdminNotification, 
  CreateNotificationRequest, 
  UpdateNotificationRequest,
  NotificationFilters
} from "../utils/adminNotificationResponseHelper";

const prisma = new PrismaClient();

export class AdminNotificationController {
  // Get all notifications
  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      // Obter o parâmetro de consulta is_read (se existir)
      const isReadFilter = req.query.is_read !== undefined
        ? req.query.is_read === 'true'
        : undefined;

      // Construir o objeto where com base no filtro
      const where: any = {};
      if (isReadFilter !== undefined) {
        where.is_read = isReadFilter;
      }

      const notificationsRaw = await prisma.adminNotification.findMany({
        where,
        orderBy: {
          created_at: 'desc'
        },
      });

      const notifications: AdminNotification[] = notificationsRaw.map(notification => ({
        ...notification,
        is_read: notification.is_read ?? false,
        source: notification.source ?? ""
      }));

      ResponseHelper.success(res, notifications, "Notifications retrieved successfully");
    } catch (error) {
      console.error("Error fetching notifications:", error);
       ResponseHelper.serverError(res, "Failed to fetch notifications");
    }
  }

  // Get notification by ID
  async getNotificationById(req: Request, res: Response): Promise<void> {
    try {
      const notificationId: number = parseInt(req.params.id);
      
      if (isNaN(notificationId) || notificationId <= 0) {
         ResponseHelper.badRequest(res, "Invalid notification ID format");
      }

      const notificationRaw = await prisma.adminNotification.findUnique({
        where: { id_notification: notificationId }
      });

      if (!notificationRaw) {
         ResponseHelper.notFound(res, `Notification with ID ${notificationId} not found`);
      }

      if (
        notificationRaw?.id_notification === undefined ||
        notificationRaw.title === undefined ||
        notificationRaw.message === undefined ||
        notificationRaw.type === undefined ||
        notificationRaw.created_at === undefined
      ) {
        ResponseHelper.serverError(res, "Notification data is incomplete");
        return;
      }

      const notification: AdminNotification = {
        id_notification: notificationRaw.id_notification,
        title: notificationRaw.title,
        message: notificationRaw.message,
        type: notificationRaw.type,
        created_at: notificationRaw.created_at,
        is_read: notificationRaw.is_read ?? false,
        source: notificationRaw.source ?? ""
      };

       ResponseHelper.success(res, notification, "Notification retrieved successfully");
    } catch (error) {
      console.error("Error fetching notification:", error);
       ResponseHelper.serverError(res, "Failed to fetch notification");
    }
  }

  // Create notification
  async createNotification(req: Request<{}, {}, CreateNotificationRequest>, res: Response): Promise<void> {
    try {
      const { title, message, source, type }: CreateNotificationRequest = req.body;

      // Validações
      if (!title || !message || !source || !type) {
         ResponseHelper.badRequest(res, "Title, message, source and type are required");
      }

      if (typeof title !== 'string' || typeof message !== 'string' || 
          typeof source !== 'string' || typeof type !== 'string') {
         ResponseHelper.badRequest(res, "All fields must be strings");
      }

      if (title.trim().length === 0 || message.trim().length === 0 || 
          source.trim().length === 0 || type.trim().length === 0) {
         ResponseHelper.badRequest(res, "Fields cannot be empty");
      }

      if (title.length > 255) {
         ResponseHelper.badRequest(res, "Title is too long (max 255 characters)");
      }

      if (message.length > 1000) {
         ResponseHelper.badRequest(res, "Message is too long (max 1000 characters)");
      }

      const newNotificationRaw = await prisma.adminNotification.create({
        data: {
          title: title.trim(),
          message: message.trim(),
          type: type.trim(),
          source: source.trim(),
        }
      });

      const newNotification: AdminNotification = {
        ...newNotificationRaw,
        is_read: newNotificationRaw.is_read ?? false,
        source: newNotificationRaw.source ?? ""
      };

       ResponseHelper.created(res, newNotification, "Notification created successfully");
    } catch (error) {
       ResponseHelper.serverError(res, "Failed to create notification");
    }
  }

  // Update notification
  async updateNotification(req: Request<{ id: string }, {}, UpdateNotificationRequest>, res: Response): Promise<void> {
    try {
      const notificationId: number = parseInt(req.params.id);
      const { title, message, is_read }: UpdateNotificationRequest = req.body;

      if (isNaN(notificationId) || notificationId <= 0) {
         ResponseHelper.badRequest(res, "Invalid notification ID format");
      }

      // Verificar se pelo menos um campo foi fornecido
      if (title === undefined && message === undefined && is_read === undefined) {
         ResponseHelper.badRequest(res, "At least one field (title, message, or is_read) must be provided");
      }

      // Validações dos campos
      if (title !== undefined) {
        if (typeof title !== 'string') {
           ResponseHelper.badRequest(res, "Title must be a string");
        }
        if (title.trim().length === 0) {
           ResponseHelper.badRequest(res, "Title cannot be empty");
        }
        if (title.length > 255) {
           ResponseHelper.badRequest(res, "Title is too long (max 255 characters)");
        }
      }

      if (message !== undefined) {
        if (typeof message !== 'string') {
           ResponseHelper.badRequest(res, "Message must be a string");
        }
        if (message.trim().length === 0) {
           ResponseHelper.badRequest(res, "Message cannot be empty");
        }
        if (message.length > 1000) {
           ResponseHelper.badRequest(res, "Message is too long (max 1000 characters)");
        }
      }

      if (is_read !== undefined && typeof is_read !== 'boolean') {
         ResponseHelper.badRequest(res, "is_read must be a boolean");
      }

      // Verificar se a notificação existe
      const existingNotification = await prisma.adminNotification.findUnique({
        where: { id_notification: notificationId },
      });

      if (!existingNotification) {
         ResponseHelper.notFound(res, `Notification with ID ${notificationId} not found`);
      }

      // Preparar dados para atualização
      const updateData: any = {};
      if (title !== undefined) updateData.title = title.trim();
      if (message !== undefined) updateData.message = message.trim();
      if (is_read !== undefined) updateData.is_read = is_read;

      const updatedNotificationRaw = await prisma.adminNotification.update({
        where: { id_notification: notificationId },
        data: updateData,
      });

      const updatedNotification: AdminNotification = {
        ...updatedNotificationRaw,
        is_read: updatedNotificationRaw.is_read ?? false,
        source: updatedNotificationRaw.source ?? ""
      };

       ResponseHelper.success(res, updatedNotification, "Notification updated successfully");
    } catch (error) {
       ResponseHelper.serverError(res, "Failed to update notification");
    }
  }

  // Mark notification as read
  async markAsRead(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const notificationId: number = parseInt(req.params.id);

      if (isNaN(notificationId) || notificationId <= 0) {
         ResponseHelper.badRequest(res, "Invalid notification ID format");
      }

      // Verificar se a notificação existe
      const existingNotification = await prisma.adminNotification.findUnique({
        where: { id_notification: notificationId },
      });

      if (!existingNotification) {
         ResponseHelper.notFound(res, `Notification with ID ${notificationId} not found`);
         return;
      }

      // Se já está marcada como lida, não fazer nada
      if (existingNotification.is_read) {
        const notification: AdminNotification = {
          ...existingNotification,
          is_read: existingNotification.is_read ?? false,
          source: existingNotification.source ?? ""
        };
         ResponseHelper.success(res, notification, "Notification is already marked as read");
         return;
      }

      const updatedNotificationRaw = await prisma.adminNotification.update({
        where: { id_notification: notificationId },
        data: {
          is_read: true,
        }
      });

      const updatedNotification: AdminNotification = {
        ...updatedNotificationRaw,
        is_read: updatedNotificationRaw.is_read ?? false,
        source: updatedNotificationRaw.source ?? ""
      };

       ResponseHelper.success(res, updatedNotification, "Notification marked as read successfully");
    } catch (error) {
       ResponseHelper.serverError(res, "Failed to mark notification as read");
    }
  }

  // Delete notification
  async deleteNotification(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const notificationId: number = parseInt(req.params.id);

      if (isNaN(notificationId) || notificationId <= 0) {
         ResponseHelper.badRequest(res, "Invalid notification ID format");
      }

      const existingNotification = await prisma.adminNotification.findUnique({
        where: { id_notification: notificationId },
      });

      if (!existingNotification) {
         ResponseHelper.notFound(res, `Notification with ID ${notificationId} not found`);
      }

      await prisma.adminNotification.delete({
        where: { id_notification: notificationId }
      });

       ResponseHelper.success(res, null, "Notification deleted successfully");
    } catch (error) {
       ResponseHelper.serverError(res, "Failed to delete notification");
    }
  }
}