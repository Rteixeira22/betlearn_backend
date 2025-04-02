
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt';


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
            const adminId = parseInt(req.params.id)
            const { name, email, username, password } = req.body
            const updatedAdmin = await prisma.admin.update({
                where: { id: adminId },
                data: {
                    name,
                    email,
                    username,
                    password,
                }
            })
            res.json(updatedAdmin)
        } catch (error) {
            res.status(500).json({ error: 'Failed to update admin' })
        }
    }

    // Delete admin
    async deleteAdmin(req: Request, res: Response) {
        try {
            const adminId = parseInt(req.params.id)
            await prisma.admin.delete({
                where: { id: adminId }
            })
            res.status(204).send()
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete admin' })
        }
    }

}