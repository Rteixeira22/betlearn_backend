import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { 
  ResponseHelper, 
  LoginRequest, 
  AdminLoginRequest, 
  LoginResponse, 
  AdminLoginResponse 
} from "../utils/authResponseHelper";


const prisma = new PrismaClient();

export class AuthController {

  async login(req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> {
    try {

      const { username, password }: LoginRequest = req.body;
      

      // Validação dos campos obrigatórios
      if (!username || !password) {
         ResponseHelper.badRequest(res, "Nome de utilizador e palavra-passe são obrigatórios");
      }

      if (typeof username !== 'string' || typeof password !== 'string') {
         ResponseHelper.badRequest(res, "Nome de utilizador e palavra-passe devem ser texto");
      }

      if (username.trim().length === 0 || password.trim().length === 0) {
         ResponseHelper.badRequest(res, "Nome de utilizador e palavra-passe não podem estar vazios");
      }

      // Verificar se o utilizador existe
      const user = await prisma.users.findUnique({
        where: { username: username.trim() },
      });

      if (!user) {
         ResponseHelper.unauthorized(res, "Credenciais inválidas");
         return;
      }

      // Verificar a senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         ResponseHelper.unauthorized(res, "Credenciais inválidas");
      }

      // Gerar token JWT
      const token = jwt.sign(
        {
          userId: user.id_user,
          email: user.email,
          username: user.username,
          role: "user",
        },
        process.env.JWT_SECRET || "seu_secret_key",
        { expiresIn: "12h" }
      );

    
      // Retornar utilizador e token
      const { password: _, ...userWithoutPassword } = user;
      const loginResponse: LoginResponse = {
        user: userWithoutPassword,
        token,
      };


       ResponseHelper.success(res, loginResponse, "Sessão iniciada com sucesso");
    } catch (error) {
       ResponseHelper.serverError(res, "Falha na autenticação");
    }
  }

  // Login de administrador
  async adminLogin(req: Request<{}, {}, AdminLoginRequest>, res: Response): Promise<void> {
    try {
      const { username, password }: AdminLoginRequest = req.body;

      // Validação dos campos obrigatórios
      if (!username || !password) {
         ResponseHelper.badRequest(res, "Nome de utilizador e palavra-passe são obrigatórios");
      }

      if (typeof username !== 'string' || typeof password !== 'string') {
         ResponseHelper.badRequest(res, "Nome de utilizador e palavra-passe devem ser texto");
      }

      if (username.trim().length === 0 || password.trim().length === 0) {
         ResponseHelper.badRequest(res, "Nome de utilizador e palavra-passe não podem estar vazios");
      }

      // Verificar se o administrador existe
      const admin = await prisma.admin.findUnique({
        where: { username: username.trim() },
      });

      if (!admin) {
         ResponseHelper.unauthorized(res, "Credenciais inválidas");
         return;
      }

      // Verificar a senha
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
         ResponseHelper.unauthorized(res, "Credenciais inválidas");
      }

      // Gerar token JWT
      const token = jwt.sign(
        {
          adminId: admin.id,
          email: admin.email,
          username: admin.username,
          role: "admin",
        },
        process.env.JWT_SECRET || "seu_secret_key",
        { expiresIn: "12h" }
      );


      // Retornar administrador e token
      const { password: _, ...adminWithoutPassword } = admin;
      const adminLoginResponse: AdminLoginResponse = {
        admin: adminWithoutPassword,
        token,
      };
       ResponseHelper.success(res, adminLoginResponse, "Sessão de administrador iniciada com sucesso");
    } catch (error) {
       ResponseHelper.serverError(res, "Falha na autenticação");
    }
  }
}