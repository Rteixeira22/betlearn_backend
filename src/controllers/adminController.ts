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

      ResponseHelper.success(res, admins, "Administradores obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching admins:", error);
      ResponseHelper.serverError(res, "Falha ao obter administradores");
    }
  }

  // Get admin by ID
  async getAdminById(req: Request, res: Response): Promise<void> {
  try {
    const adminId: number = parseInt(req.params.id);
    const tokenUserId: number = parseInt(req.adminId!);

    if (isNaN(adminId) || adminId <= 0) {
      ResponseHelper.badRequest(res, "Formato de ID de administrador inválido");
      return;
    }

    if (isNaN(tokenUserId)) {
      ResponseHelper.unauthorized(res, "Token inválido");
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
      ResponseHelper.notFound(res, `Administrador com ID ${adminId} não encontrado`);
      return;
    }

    const admin: AdminPublic = {
      ...adminRaw
    };

    ResponseHelper.success(res, admin, "Administrador obtido com sucesso");
  } catch (error) {
    console.error("Error fetching admin:", error);
    ResponseHelper.serverError(res, "Falha ao obter administrador");
  }
}


  // Create admin
  async createAdmin(req: Request<{}, {}, CreateAdminRequest>, res: Response): Promise<void> {
  try {
    const { name, email, username, password }: CreateAdminRequest = req.body;

    // Validações
    if (!name || !email || !username || !password) {
      ResponseHelper.badRequest(res, "Nome, email, nome de utilizador e palavra-passe são obrigatórios");
      return;
    }

    if (typeof name !== 'string' || typeof email !== 'string' || 
        typeof username !== 'string' || typeof password !== 'string') {
      ResponseHelper.badRequest(res, "Todos os campos devem ser texto");
      return;
    }

    if (name.trim().length === 0 || email.trim().length === 0 || 
        username.trim().length === 0 || password.trim().length === 0) {
      ResponseHelper.badRequest(res, "Os campos não podem estar vazios");
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ResponseHelper.badRequest(res, "Formato de email inválido");
      return;
    }

    // Validação de username
    if (username.length < 3) {
      ResponseHelper.badRequest(res, "O nome de utilizador deve ter pelo menos 3 caracteres");
      return;
    }

    // Validação de password
    if (password.length < 6) {
      ResponseHelper.badRequest(res, "A palavra-passe deve ter pelo menos 6 caracteres");
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
        ResponseHelper.conflict(res, "Email já existe");
        return;
      }
      if (existingAdmin.username === username.trim()) {
        ResponseHelper.conflict(res, "Nome de utilizador já existe");
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

    ResponseHelper.created(res, newAdmin, "Administrador criado com sucesso");
  } catch (error) {
    console.error("Error creating admin:", error);
    ResponseHelper.serverError(res, "Falha ao criar administrador");
  }
}


  // Update admin
  async updateAdmin(req: Request<{ id: string }, {}, UpdateAdminRequest>, res: Response): Promise<void> {
  try {
    const adminId: number = parseInt(req.params.id);
    const tokenUserId: number = parseInt(req.adminId!);
    const { name, email, username, password }: UpdateAdminRequest = req.body;

    if (isNaN(adminId) || adminId <= 0) {
      ResponseHelper.badRequest(res, "Formato de ID de administrador inválido");
      return;
    }

    if (isNaN(tokenUserId)) {
      ResponseHelper.unauthorized(res, "Token inválido");
      return;
    }

    if (!name && !email && !username && !password) {
      ResponseHelper.badRequest(res, "Pelo menos um campo deve ser fornecido para atualização");
      return;
    }

    if (name !== undefined) {
      if (typeof name !== 'string') {
        ResponseHelper.badRequest(res, "O nome deve ser texto");
        return;
      }
      if (name.trim().length === 0) {
        ResponseHelper.badRequest(res, "O nome não pode estar vazio");
        return;
      }
    }

    if (email !== undefined) {
      if (typeof email !== 'string') {
        ResponseHelper.badRequest(res, "O email deve ser texto");
        return;
      }
      if (email.trim().length === 0) {
        ResponseHelper.badRequest(res, "O email não pode estar vazio");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        ResponseHelper.badRequest(res, "Formato de email inválido");
        return;
      }
    }

    if (username !== undefined) {
      if (typeof username !== 'string') {
        ResponseHelper.badRequest(res, "O nome de utilizador deve ser texto");
        return;
      }
      if (username.trim().length === 0) {
        ResponseHelper.badRequest(res, "O nome de utilizador não pode estar vazio");
        return;
      }
      if (username.length < 3) {
        ResponseHelper.badRequest(res, "O nome de utilizador deve ter pelo menos 3 caracteres");
        return;
      }
    }

    if (password !== undefined) {
      if (typeof password !== 'string') {
        ResponseHelper.badRequest(res, "A palavra-passe deve ser texto");
        return;
      }
      if (password.trim().length === 0) {
        ResponseHelper.badRequest(res, "A palavra-passe não pode estar vazia");
        return;
      }
      if (password.length < 6) {
        ResponseHelper.badRequest(res, "A palavra-passe deve ter pelo menos 6 caracteres");
        return;
      }
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!existingAdmin) {
      ResponseHelper.notFound(res, `Administrador com ID ${adminId} não encontrado`);
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
          ResponseHelper.conflict(res, "Email já existe");
          return;
        }
        if (username && conflictAdmin.username === username.trim()) {
          ResponseHelper.conflict(res, "Nome de utilizador já existe");
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

    ResponseHelper.success(res, updatedAdmin, "Administrador atualizado com sucesso");
  } catch (error) {
    console.error("Error updating admin:", error);
    ResponseHelper.serverError(res, "Falha ao atualizar administrador");
  }
}


  // Delete admin
  async deleteAdmin(req: Request<{ id: string }>, res: Response): Promise<void> {
  try {
    const adminId: number = parseInt(req.params.id);
    const tokenUserId: number = parseInt(req.adminId!);

    if (isNaN(adminId) || adminId <= 0) {
      ResponseHelper.badRequest(res, "Formato de ID de administrador inválido");
      return;
    }

    if (isNaN(tokenUserId)) {
      ResponseHelper.unauthorized(res, "Token inválido");
      return;
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!existingAdmin) {
      ResponseHelper.notFound(res, `Administrador com ID ${adminId} não encontrado`);
      return;
    }

    await prisma.admin.delete({
      where: { id: adminId }
    });

    ResponseHelper.success(res, null, "Administrador eliminado com sucesso");
  } catch (error) {
    console.error("Error deleting admin:", error);
    ResponseHelper.serverError(res, "Falha ao eliminar administrador");
  }
}

}