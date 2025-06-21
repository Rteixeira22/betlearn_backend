import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { 
  AdminNotification, 
  CreateNotificationRequest, 
  UpdateNotificationRequest,
  NotificationFilters
} from "../utils/adminNotificationDataType";

import { ResponseHelper } from '../utils/responseHelper';

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

      ResponseHelper.success(res, notifications, "Notificações obtidas com sucesso");
    } catch (error) {
      console.error("Error fetching notifications:", error);
       ResponseHelper.serverError(res, "Falha ao obter notificações");
    }
  }

  // Get notification by ID
  async getNotificationById(req: Request, res: Response): Promise<void> {
    try {
      const notificationId: number = parseInt(req.params.id);
      
      if (isNaN(notificationId) || notificationId <= 0) {
         ResponseHelper.badRequest(res, "Formato de ID de notificação inválido");
      }

      const notificationRaw = await prisma.adminNotification.findUnique({
        where: { id_notification: notificationId }
      });

      if (!notificationRaw) {
         ResponseHelper.notFound(res, `Notificação com ID ${notificationId} não encontrada`);
      }

      if (
        notificationRaw?.id_notification === undefined ||
        notificationRaw.title === undefined ||
        notificationRaw.message === undefined ||
        notificationRaw.type === undefined ||
        notificationRaw.created_at === undefined
      ) {
        ResponseHelper.serverError(res, "Os dados da notificação estão incompletos");
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

       ResponseHelper.success(res, notification, "Notificação obtida com sucesso");
    } catch (error) {
      console.error("Error fetching notification:", error);
       ResponseHelper.serverError(res, "Falha ao obter notificação");
    }
  }

  // Create notification
  async createNotification(req: Request<{}, {}, CreateNotificationRequest>, res: Response): Promise<void> {
    try {
      const { title, message, source, type }: CreateNotificationRequest = req.body;

      // Validações
      if (!title || !message || !source || !type) {
         ResponseHelper.badRequest(res, "Título, mensagem, origem e tipo são obrigatórios");
      }

      if (typeof title !== 'string' || typeof message !== 'string' || 
          typeof source !== 'string' || typeof type !== 'string') {
         ResponseHelper.badRequest(res, "Todos os campos devem ser texto");
      }

      if (title.trim().length === 0 || message.trim().length === 0 || 
          source.trim().length === 0 || type.trim().length === 0) {
         ResponseHelper.badRequest(res, "Os campos não podem estar vazios");
      }

      if (title.length > 255) {
         ResponseHelper.badRequest(res, "Título demasiado longo (máximo 255 caracteres)");
      }

      if (message.length > 1000) {
         ResponseHelper.badRequest(res, "Mensagem demasiado longa (máximo 1000 caracteres)");
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

       ResponseHelper.created(res, newNotification, "Notificação criada com sucesso");
    } catch (error) {
       ResponseHelper.serverError(res, "Falha ao criar notificação");
    }
  }

  // Update notification
  async updateNotification(req: Request<{ id: string }, {}, UpdateNotificationRequest>, res: Response): Promise<void> {
    try {
      const notificationId: number = parseInt(req.params.id);
      const { title, message, is_read }: UpdateNotificationRequest = req.body;

      if (isNaN(notificationId) || notificationId <= 0) {
         ResponseHelper.badRequest(res, "Formato de ID de notificação inválido");
      }

      // Verificar se pelo menos um campo foi fornecido
      if (title === undefined && message === undefined && is_read === undefined) {
         ResponseHelper.badRequest(res, "Pelo menos um campo (título, mensagem ou lida) deve ser fornecido");
      }

      // Validações dos campos
      if (title !== undefined) {
        if (typeof title !== 'string') {
           ResponseHelper.badRequest(res, "O título deve ser texto");
        }
        if (title.trim().length === 0) {
           ResponseHelper.badRequest(res, "O título não pode estar vazio");
        }
        if (title.length > 255) {
           ResponseHelper.badRequest(res, "Título demasiado longo (máximo 255 caracteres)");
        }
      }

      if (message !== undefined) {
        if (typeof message !== 'string') {
           ResponseHelper.badRequest(res, "A mensagem deve ser texto");
        }
        if (message.trim().length === 0) {
           ResponseHelper.badRequest(res, "A mensagem não pode estar vazia");
        }
        if (message.length > 1000) {
           ResponseHelper.badRequest(res, "Mensagem demasiado longa (máximo 1000 caracteres)");
        }
      }

      if (is_read !== undefined && typeof is_read !== 'boolean') {
         ResponseHelper.badRequest(res, "O campo 'lida' deve ser verdadeiro ou falso");
      }

      // Verificar se a notificação existe
      const existingNotification = await prisma.adminNotification.findUnique({
        where: { id_notification: notificationId },
      });

      if (!existingNotification) {
         ResponseHelper.notFound(res, `Notificação com ID ${notificationId} não encontrada`);
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

       ResponseHelper.success(res, updatedNotification, "Notificação atualizada com sucesso");
    } catch (error) {
       ResponseHelper.serverError(res, "Falha ao atualizar notificação");
    }
  }

  // Mark notification as read
  async markAsRead(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const notificationId: number = parseInt(req.params.id);

      if (isNaN(notificationId) || notificationId <= 0) {
         ResponseHelper.badRequest(res, "Formato de ID de notificação inválido");
      }

      // Verificar se a notificação existe
      const existingNotification = await prisma.adminNotification.findUnique({
        where: { id_notification: notificationId },
      });

      if (!existingNotification) {
         ResponseHelper.notFound(res, `Notificação com ID ${notificationId} não encontrada`);
         return;
      }

      // Se já está marcada como lida, não fazer nada
      if (existingNotification.is_read) {
        const notification: AdminNotification = {
          ...existingNotification,
          is_read: existingNotification.is_read ?? false,
          source: existingNotification.source ?? ""
        };
         ResponseHelper.success(res, notification, "A notificação já está marcada como lida");
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

       ResponseHelper.success(res, updatedNotification, "Notificação marcada como lida com sucesso");
    } catch (error) {
       ResponseHelper.serverError(res, "Falha ao marcar notificação como lida");
    }
  }

  // Delete notification
  async deleteNotification(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const notificationId: number = parseInt(req.params.id);

      if (isNaN(notificationId) || notificationId <= 0) {
         ResponseHelper.badRequest(res, "Formato de ID de notificação inválido");
      }

      const existingNotification = await prisma.adminNotification.findUnique({
        where: { id_notification: notificationId },
      });

      if (!existingNotification) {
         ResponseHelper.notFound(res, `Notificação com ID ${notificationId} não encontrada`);
      }

      await prisma.adminNotification.delete({
        where: { id_notification: notificationId }
      });

       ResponseHelper.success(res, null, "Notificação eliminada com sucesso");
    } catch (error) {
       ResponseHelper.serverError(res, "Falha ao eliminar notificação");
    }
  }
}