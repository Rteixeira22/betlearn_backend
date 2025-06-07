
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt';

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
    }
  }
}

const prisma = new PrismaClient()

export class AdminController {

    // Get all admins
    async getAdmins(req: Request, res: Response) {

        try {
            const admins = await prisma.admin.findMany()
            res.json(admins)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch admins' })
        }
    }

    // Get admin by ID
    async getAdminById(req: Request, res: Response) {
        try {
            const adminId = parseInt(req.params.id)

            const tokenUserId = parseInt(req.adminId!);
            
            if (adminId !== tokenUserId) {
                res.status(403).json({ error: 'Não está autorizado a aceder ao perfil de outro utilizador' });
                return;
            }

            const admin = await prisma.admin.findUnique({
                where: { id: adminId }
            })
            
            res.json(admin)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch admin' })
        }
    }

    // Create admin
    async createAdmin(req: Request, res: Response) {
        try {
            const { name, email, username, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 10)
            const newAdmin = await prisma.admin.create({
                data: {
                    name,
                    email,
                    username,
                    password: hashedPassword,
                }
            })
            res.json(newAdmin)
        } catch (error) {
            res.status(500).json({ error: 'Failed to create admin' })
        }
    }

    // Update admin
   async updateAdmin(req: Request, res: Response) {
    try {
      const adminId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.adminId!);

      if (adminId !== tokenUserId) {
        res.status(403).json({ 
          error: 'Acesso restrito' 
        });
        return;
      }

      const { name, email, username, password } = req.body;
      
      const updateData: any = {};
      
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (username) updateData.username = username;
      
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedAdmin = await prisma.admin.update({
        where: { id: adminId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
        }
      });
      
      res.json(updatedAdmin);
    } catch (error) {
      console.error('Error updating admin:', error);
      res.status(500).json({ error: 'Failed to update admin' });
    }
  }

    // Delete admin
    async deleteAdmin(req: Request, res: Response) {
        try {
            const adminId = parseInt(req.params.id)

            const tokenUserId = parseInt(req.adminId!);
            
            if (adminId !== tokenUserId) {
                res.status(403).json({ error: 'Acesso restrito' });
                return;
            }
            await prisma.admin.delete({
                where: { id: adminId }
            })
            res.status(204).send()
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete admin' })
        }
    }

}