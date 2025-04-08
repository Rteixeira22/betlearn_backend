import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Verificar se o usuário existe
      const user = await prisma.users.findUnique({
        where: { username },
      });

      if (!user) {
        res.status(401).json({ error: "Credenciais inválidas" });
      } else {
        // Verificar a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          res.status(401).json({ error: "Credenciais inválidas" });
        }

        // Gerar token JWT
        const token = jwt.sign(
          {
            userId: user.id_user,
            email: user.email,
            username: user.username,
          },
          process.env.JWT_SECRET || "seu_secret_key",
          { expiresIn: "12h" }
        );

        // Retornar usuário e token
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({
          user: userWithoutPassword,
          token,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Falha na autenticação" });
    }
  }

  //Login admin

  async adminLogin(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Verificar se o administrador existe
      const admin = await prisma.admin.findUnique({
        where: { username },
      });

      if (!admin) {
        res.status(401).json({ error: "Credenciais inválidas" });
      } else {
        // Verificar a senha
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
          res.status(401).json({ error: "Credenciais inválidas" });
        }

        // Gerar token JWT
        const token = jwt.sign(
          {
            adminId: admin.id,
            email: admin.email,
            username: admin.username,
          },
          process.env.JWT_SECRET || "seu_secret_key",
          { expiresIn: "12h" }
        );

        // Retornar administrador e token
        const { password: _, ...adminWithoutPassword } = admin;
        res.status(200).json({
          admin: adminWithoutPassword,
          token,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Falha na autenticação" });
    }
  }
}
