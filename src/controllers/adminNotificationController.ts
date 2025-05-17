import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()


export class AdminNotificationController {

    //Get all notifications
    async getNotifications(req: Request, res: Response) {
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

            const notifications = await prisma.adminNotification.findMany({
                where,
                orderBy: {
                    created_at: 'desc'
                },
            });

            res.json(notifications);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    }

    
    async getNotificationById(req: Request, res: Response) {
        try {
            const notificationId = parseInt(req.params.id);
            const notification = await prisma.adminNotification.findUnique({
                where: { id_notification: notificationId }
            });
            res.json(notification);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch notification' });
        }
    }

    // Create notification
    async createNotification(req: Request, res: Response) {
        try {
            const { title, message, source, type } = req.body;
            const newNotification = await prisma.adminNotification.create({
                data: {
                    title,
                    message,
                    type,
                    source,
                }
            });
            res.json(newNotification);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create notification' });
        }
    }

    // Update notification
    async updateNotification(req: Request, res: Response) {
        try {
            const notificationId = parseInt(req.params.id);
            const { title, message, is_read } = req.body;
            const updatedNotification = await prisma.adminNotification.update({
                where: { id_notification: notificationId },
                data: {
                    title,
                    message,
                    is_read,
                }
            });
            res.json(updatedNotification);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update notification' });
        }
    }

    // Delete notification
    async deleteNotification(req: Request, res: Response) {
        try {
            const notificationId = parseInt(req.params.id);
            await prisma.adminNotification.delete({
                where: { id_notification: notificationId }
            });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete notification' });
        }
    }




}

