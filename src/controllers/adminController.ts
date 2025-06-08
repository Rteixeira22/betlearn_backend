import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { 
  ResponseHelper, 
  Admin, 
  AdminPublic,
  CreateAdminRequest, 
  UpdateAdminRequest
} from "../utils/adminResponseHelper";

const prisma = new PrismaClient();

export class AdminController {
  // Get all admins
  async getAdmins(req: Request, res: Response): Promise<void> {
    try {
      const adminsRaw = await prisma.admin.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
        },
      });

      const admins: AdminPublic[] = adminsRaw.map((admin) => ({
        ...admin,
      }));

      ResponseHelper.success(res, admins, "Admins retrieved successfully");
    } catch (error) {
      console.error("Error fetching admins:", error);
      ResponseHelper.serverError(res, "Failed to fetch admins");
    }
  }

  // Get admin by ID
  async getAdminById(req: Request, res: Response): Promise<void> {
  try {
    const adminId: number = parseInt(req.params.id);
    const tokenUserId: number = parseInt(req.adminId!);

    if (isNaN(adminId) || adminId <= 0) {
      ResponseHelper.badRequest(res, "Invalid admin ID format");
      return;
    }

    if (isNaN(tokenUserId)) {
      ResponseHelper.unauthorized(res, "Invalid token");
      return;
    }

    if (adminId !== tokenUserId) {
      ResponseHelper.forbidden(res, "Não está autorizado a aceder ao perfil de outro utilizador");
      return;
    }

    const adminRaw = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
      }
    });

    if (!adminRaw) {
      ResponseHelper.notFound(res, `Admin with ID ${adminId} not found`);
      return;
    }

    const admin: AdminPublic = {
      ...adminRaw
    };

    ResponseHelper.success(res, admin, "Admin retrieved successfully");
  } catch (error) {
    console.error("Error fetching admin:", error);
    ResponseHelper.serverError(res, "Failed to fetch admin");
  }
}


  // Create admin
  async createAdmin(req: Request<{}, {}, CreateAdminRequest>, res: Response): Promise<void> {
  try {
    const { name, email, username, password }: CreateAdminRequest = req.body;

    // Validações
    if (!name || !email || !username || !password) {
      ResponseHelper.badRequest(res, "Name, email, username and password are required");
      return;
    }

    if (typeof name !== 'string' || typeof email !== 'string' || 
        typeof username !== 'string' || typeof password !== 'string') {
      ResponseHelper.badRequest(res, "All fields must be strings");
      return;
    }

    if (name.trim().length === 0 || email.trim().length === 0 || 
        username.trim().length === 0 || password.trim().length === 0) {
      ResponseHelper.badRequest(res, "Fields cannot be empty");
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ResponseHelper.badRequest(res, "Invalid email format");
      return;
    }

    // Validação de username
    if (username.length < 3) {
      ResponseHelper.badRequest(res, "Username must be at least 3 characters long");
      return;
    }

    // Validação de password
    if (password.length < 6) {
      ResponseHelper.badRequest(res, "Password must be at least 6 characters long");
      return;
    }

    // Verificar se email ou username já existem
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email: email.trim() },
          { username: username.trim() }
        ]
      }
    });

    if (existingAdmin) {
      if (existingAdmin.email === email.trim()) {
        ResponseHelper.conflict(res, "Email already exists");
        return;
      }
      if (existingAdmin.username === username.trim()) {
        ResponseHelper.conflict(res, "Username already exists");
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdminRaw = await prisma.admin.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        username: username.trim(),
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
      }
    });

    const newAdmin: AdminPublic = {
      ...newAdminRaw
    };

    ResponseHelper.created(res, newAdmin, "Admin created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
    ResponseHelper.serverError(res, "Failed to create admin");
  }
}


  // Update admin
  async updateAdmin(req: Request<{ id: string }, {}, UpdateAdminRequest>, res: Response): Promise<void> {
  try {
    const adminId: number = parseInt(req.params.id);
    const tokenUserId: number = parseInt(req.adminId!);
    const { name, email, username, password }: UpdateAdminRequest = req.body;

    if (isNaN(adminId) || adminId <= 0) {
      ResponseHelper.badRequest(res, "Invalid admin ID format");
      return;
    }

    if (isNaN(tokenUserId)) {
      ResponseHelper.unauthorized(res, "Invalid token");
      return;
    }

    if (adminId !== tokenUserId) {
      ResponseHelper.forbidden(res, "Acesso restrito");
      return;
    }

    if (!name && !email && !username && !password) {
      ResponseHelper.badRequest(res, "At least one field must be provided for update");
      return;
    }

    if (name !== undefined) {
      if (typeof name !== 'string') {
        ResponseHelper.badRequest(res, "Name must be a string");
        return;
      }
      if (name.trim().length === 0) {
        ResponseHelper.badRequest(res, "Name cannot be empty");
        return;
      }
    }

    if (email !== undefined) {
      if (typeof email !== 'string') {
        ResponseHelper.badRequest(res, "Email must be a string");
        return;
      }
      if (email.trim().length === 0) {
        ResponseHelper.badRequest(res, "Email cannot be empty");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        ResponseHelper.badRequest(res, "Invalid email format");
        return;
      }
    }

    if (username !== undefined) {
      if (typeof username !== 'string') {
        ResponseHelper.badRequest(res, "Username must be a string");
        return;
      }
      if (username.trim().length === 0) {
        ResponseHelper.badRequest(res, "Username cannot be empty");
        return;
      }
      if (username.length < 3) {
        ResponseHelper.badRequest(res, "Username must be at least 3 characters long");
        return;
      }
    }

    if (password !== undefined) {
      if (typeof password !== 'string') {
        ResponseHelper.badRequest(res, "Password must be a string");
        return;
      }
      if (password.trim().length === 0) {
        ResponseHelper.badRequest(res, "Password cannot be empty");
        return;
      }
      if (password.length < 6) {
        ResponseHelper.badRequest(res, "Password must be at least 6 characters long");
        return;
      }
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!existingAdmin) {
      ResponseHelper.notFound(res, `Admin with ID ${adminId} not found`);
      return;
    }

    if (email || username) {
      const conflictAdmin = await prisma.admin.findFirst({
        where: {
          AND: [
            { id: { not: adminId } },
            {
              OR: [
                ...(email ? [{ email: email.trim() }] : []),
                ...(username ? [{ username: username.trim() }] : [])
              ]
            }
          ]
        }
      });

      if (conflictAdmin) {
        if (email && conflictAdmin.email === email.trim()) {
          ResponseHelper.conflict(res, "Email already exists");
          return;
        }
        if (username && conflictAdmin.username === username.trim()) {
          ResponseHelper.conflict(res, "Username already exists");
          return;
        }
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim();
    if (username !== undefined) updateData.username = username.trim();
    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdminRaw = await prisma.admin.update({
      where: { id: adminId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
      }
    });

    const updatedAdmin: AdminPublic = {
      ...updatedAdminRaw
    };

    ResponseHelper.success(res, updatedAdmin, "Admin updated successfully");
  } catch (error) {
    console.error("Error updating admin:", error);
    ResponseHelper.serverError(res, "Failed to update admin");
  }
}


  // Delete admin
  async deleteAdmin(req: Request<{ id: string }>, res: Response): Promise<void> {
  try {
    const adminId: number = parseInt(req.params.id);
    const tokenUserId: number = parseInt(req.adminId!);

    if (isNaN(adminId) || adminId <= 0) {
      ResponseHelper.badRequest(res, "Invalid admin ID format");
      return;
    }

    if (isNaN(tokenUserId)) {
      ResponseHelper.unauthorized(res, "Invalid token");
      return;
    }

    if (adminId !== tokenUserId) {
      ResponseHelper.forbidden(res, "Acesso restrito");
      return;
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!existingAdmin) {
      ResponseHelper.notFound(res, `Admin with ID ${adminId} not found`);
      return;
    }

    await prisma.admin.delete({
      where: { id: adminId }
    });

    ResponseHelper.success(res, null, "Admin deleted successfully");
  } catch (error) {
    console.error("Error deleting admin:", error);
    ResponseHelper.serverError(res, "Failed to delete admin");
  }
}

}