import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt';
import { 
  User,
  UserWithoutPassword,
  UserChallenge,
  UserBet,
  LeaderboardEntry,
  CreateUserRequest,
  UpdateUserProfileRequest,
  UpdateUserPasswordRequest,
  UpdateUserMoneyRequest,
  UpdateUserPointsRequest,
  UpdateUserBetsVisibilityRequest,
  UpdateUserTutorialVerificationRequest
} from "../utils/userDataType";

import { 
  ResponseHelper, 
} from "../utils/responseHelper";

// Extend Express Request interface to include userId and userRole
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: 'user' | 'admin';
    }
  }
}

const prisma = new PrismaClient()

export class UserController {

  async getAllusers(req: Request, res: Response): Promise<void> {
    try {
      const users = await prisma.users.findMany({
        select: {
          id_user: true,
          name: true,
          username: true,
          points: true,
          image: true,
          money: true,
          email: true,
          birthdate: true,
        },
        orderBy: {
          id_user: 'asc'
        }
      });
      
      ResponseHelper.success(res, users, "Utilizadores obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching users:", error);
      ResponseHelper.serverError(res, "Falha ao obter utilizadores");
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }

      const user = await prisma.users.findUnique({
        select: {
          id_user: true,
          name: true,
          username: true,
          email: true,
          birthdate: true,
          image: true,
          money: true,
          points: true,
          tutorial_verification: true,
          bets_visibility: true,
          QuestionnaireResponse: true,
        },
        where: { id_user: requestedId },
      });

      if (!user) {
        ResponseHelper.notFound(res, `Utilizador com ID ${requestedId} não encontrado`);
        return;
      }
      ResponseHelper.success(res, user, "Utilizador obtido com sucesso");
    } catch (error) {
      console.error("Error fetching user:", error);
      ResponseHelper.serverError(res, "Falha ao obter dados do utilizador");
    }
  }


  async getOtherUserById(req: Request, res: Response): Promise<void> {
    try {
      const requestedId = parseInt(req.params.id);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }


      const user = await prisma.users.findUnique({
        select: {
          id_user: true,
          name: true,
          username: true,
          image: true,
          money: true,
          points: true,
          bets_visibility: true,
        },
        where: { id_user: requestedId },
      });

      if (!user) {
        ResponseHelper.notFound(res, `Utilizador com ID ${requestedId} não encontrado`);
        return;
      }
      ResponseHelper.success(res, user, "Utilizador obtido com sucesso");
    } catch (error) {
      console.error("Error fetching user:", error);
      ResponseHelper.serverError(res, "Falha ao obter dados do utilizador");
    }
  }

  // Get user challenges
  async getUserChallenges(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }
      
      const challenges = await prisma.user_has_Challenges.findMany({
        where: { ref_id_user: requestedId },
        include: {
          challenge: true
        }
      });
      
      ResponseHelper.success(res, challenges, "Desafios do utilizador obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      ResponseHelper.serverError(res, "Falha ao obter desafios do utilizador");
    }
  }

  // Get user bet history
  async getUserBetHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }      
      
      const bets = await prisma.bets.findMany({
        where: { ref_id_user: userId },
        orderBy: { date: 'desc' }
      });
      
      ResponseHelper.success(res, bets, "Histórico de apostas obtido com sucesso");
    } catch (error) {
      console.error("Error fetching bet history:", error);
      ResponseHelper.serverError(res, "Falha ao obter histórico de apostas");
    }
  }

  // Get active user bets
  async getActiveBets(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }

      const activeBets = await prisma.bets.findMany({
        where: { 
          ref_id_user: userId,
          state: 0 
        },
        orderBy: { date: 'desc' }
      });
      
      ResponseHelper.success(res, activeBets, "Apostas ativas obtidas com sucesso");
    } catch (error) {
      console.error("Error fetching active bets:", error);
      ResponseHelper.serverError(res, "Falha ao obter apostas ativas");
    }
  }

  // Get closed bets
  async getClosedBets(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }

      const closedBets = await prisma.bets.findMany({
        where: { 
          ref_id_user: userId,
          state: 1 
        },
        orderBy: { date: 'desc' }
      });
      
      ResponseHelper.success(res, closedBets, "Apostas encerradas obtidas com sucesso");
    } catch (error) {
      console.error("Error fetching closed bets:", error);
      ResponseHelper.serverError(res, "Falha ao obter apostas encerradas");
    }
  }

  // Get won bets
  async getWonBets(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }

      const wonBets = await prisma.bets.findMany({
        where: { 
          ref_id_user: userId,
          state: 1, 
          result: 1 
        },
        orderBy: { date: 'desc' }
      });
      
      ResponseHelper.success(res, wonBets, "Apostas ganhas obtidas com sucesso");
    } catch (error) {
      console.error("Error fetching won bets:", error);
      ResponseHelper.serverError(res, "Falha ao obter apostas ganhas");
    }
  }

  // Get lost bets
  async getLostBets(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }

      const lostBets = await prisma.bets.findMany({
        where: { 
          ref_id_user: userId,
          state: 1, 
          result: 0 
        },
        orderBy: { date: 'desc' }
      });
      
      ResponseHelper.success(res, lostBets, "Apostas perdidas obtidas com sucesso");
    } catch (error) {
      console.error("Error fetching lost bets:", error);
      ResponseHelper.serverError(res, "Falha ao obter apostas perdidas");
    }
  }

  // Get user by username
  async getUserByUsername(req: Request, res: Response): Promise<void> {
    try {
      const username = req.params.username;

      if (!username || username.trim().length === 0) {
        ResponseHelper.badRequest(res, "Nome de utilizador é obrigatório");
        return;
      }

      const user = await prisma.users.findUnique({
        where: { username: username }
      });

      if (!user) {
        ResponseHelper.notFound(res, "Utilizador não encontrado");
        return;
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      ResponseHelper.success(res, userWithoutPassword, "Utilizador obtido com sucesso");
    } catch (error) {
      console.error("Error fetching user by username:", error);
      ResponseHelper.serverError(res, "Falha ao obter utilizador");
    }
  }

  // Get user by email
  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;

      if (!email || email.trim().length === 0) {
        ResponseHelper.badRequest(res, "Email é obrigatório");
        return;
      }

      const user = await prisma.users.findUnique({
        where: { email }
      });

      if (!user) {
        ResponseHelper.notFound(res, "Utilizador não encontrado");
        return;
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      ResponseHelper.success(res, userWithoutPassword, "Utilizador obtido com sucesso");
    } catch (error) {
      console.error("Error fetching user by email:", error);
      ResponseHelper.serverError(res, "Falha ao obter utilizador");
    }
  }

  // Create a new user
  async createUser(req: Request<{}, {}, CreateUserRequest>, res: Response): Promise<void> {
    try {
      const { name, email, username, birthdate, password, image, money = 0, points = 0, tutorial_verification = false, has_accepted_terms = false } = req.body;

      // Validation
      if (!name || name.trim().length === 0) {
        ResponseHelper.badRequest(res, "Nome é obrigatório");
        return;
      }

      if (!email || email.trim().length === 0) {
        ResponseHelper.badRequest(res, "Email é obrigatório");
        return;
      }

      if (!username || username.trim().length === 0) {
        ResponseHelper.badRequest(res, "Nome de utilizador é obrigatório");
        return;
      }

      if (!password || password.length < 8) {
        ResponseHelper.badRequest(res, "A palavra-passe deve ter pelo menos 8 caracteres");
        return;
      }

      if (!birthdate) {
        ResponseHelper.badRequest(res, "Data de nascimento é obrigatória");
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [
            { email: email.trim() },
            { username: username.trim() }
          ]
        }
      });

      if (existingUser) {
        if (existingUser.email === email.trim()) {
          ResponseHelper.conflict(res, "Email já existe");
        } else {
          ResponseHelper.conflict(res, "Nome de utilizador já existe");
        }
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.users.create({
        data: {
          name: name.trim(),
          email: email.trim(),
          username: username.trim(),
          birthdate: new Date(birthdate),
          password: hashedPassword,
          image,
          money,
          points,
          tutorial_verification,  
          has_accepted_terms, 
        }
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;
      ResponseHelper.created(res, userWithoutPassword, "Utilizador criado com sucesso");
    } catch (error) {
      console.error("Error creating user:", error);
      ResponseHelper.serverError(res, "Falha ao criar utilizador");
    }
  }

  // Delete a user
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }

      const existingUser = await prisma.users.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `Utilizador com ID ${userId} não encontrado`);
        return;
      }

      await prisma.users.delete({
        where: { id_user: userId }
      });

      ResponseHelper.success(res, null, "Utilizador eliminado com sucesso");
    } catch (error) {
      console.error("Error deleting user:", error);
      ResponseHelper.serverError(res, "Falha ao eliminar utilizador");
    }
  }

  // Update user password
  async updateUserPassword(req: Request<{ id: string }, {}, UpdateUserPasswordRequest>, res: Response): Promise<void> {
    try {
      const requestedId = parseInt(req.params.id);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      const { password } = req.body;
      if (!password || password.length < 8) {
        ResponseHelper.badRequest(res, "A palavra-passe deve ter pelo menos 8 caracteres");
        return;
      }

      const existingUser = await prisma.users.findUnique({ 
        where: { id_user: requestedId } 
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `Utilizador com ID ${requestedId} não encontrado`);
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.users.update({
        where: { id_user: requestedId },
        data: { password: hashedPassword },
      });

      ResponseHelper.success(res, null, "Palavra-passe atualizada com sucesso");
    } catch (error) {
      console.error("Password update error:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar palavra-passe do utilizador");
    }
  }

  // Update user profile
  async updateUserProfile(req: Request<{ id: string }, {}, UpdateUserProfileRequest>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }

      const { name, email, username, image } = req.body;

      // Check if at least one field is provided
      if (!name && !email && !username && !image) {
        ResponseHelper.badRequest(res, "Pelo menos um campo deve ser fornecido para atualização");
        return;
      }

      const existingUser = await prisma.users.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `Utilizador com ID ${userId} não encontrado`);
        return;
      }

      // Check for duplicate email or username if they are being updated
      if (email || username) {
        const duplicateCheck = await prisma.users.findFirst({
          where: {
            AND: [
              { id_user: { not: userId } },
              {
                OR: [
                  ...(email ? [{ email: email.trim() }] : []),
                  ...(username ? [{ username: username.trim() }] : [])
                ]
              }
            ]
          }
        });

        if (duplicateCheck) {
          if (duplicateCheck.email === email?.trim()) {
            ResponseHelper.conflict(res, "Email já existe");
          } else {
            ResponseHelper.conflict(res, "Nome de utilizador já existe");
          }
          return;
        }
      }
      
      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: {
          ...(name && { name: name.trim() }),
          ...(email && { email: email.trim() }),
          ...(username && { username: username.trim() }),
          ...(image !== undefined && { image })
        }
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      ResponseHelper.success(res, userWithoutPassword, "Perfil do utilizador atualizado com sucesso");
    } catch (error) {
      console.error("Error updating user profile:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar perfil do utilizador");
    }
  }

  // Update user money
  async updateUserMoney(req: Request<{ id: string }, {}, UpdateUserMoneyRequest>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { money } = req.body;

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (typeof money !== 'number' || money < 0) {
        ResponseHelper.badRequest(res, "Dinheiro deve ser um número não negativo");
        return;
      }

      const existingUser = await prisma.users.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `Utilizador com ID ${userId} não encontrado`);
        return;
      }
      
      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: { money }
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      ResponseHelper.success(res, userWithoutPassword, "Dinheiro do utilizador atualizado com sucesso");
    } catch (error) {
      console.error("Error updating user money:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar dinheiro do utilizador");
    }
  }

  // Update user points
  async updateUserPoints(req: Request<{ id: string }, {}, UpdateUserPointsRequest>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { points } = req.body;
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }

      if (typeof points !== 'number' || points < 0) {
        ResponseHelper.badRequest(res, "Pontos devem ser um número não negativo");
        return;
      }

      const existingUser = await prisma.users.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `Utilizador com ID ${userId} não encontrado`);
        return;
      }
      
      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: { points }
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      ResponseHelper.success(res, userWithoutPassword, "Pontos do utilizador atualizados com sucesso");
    } catch (error) {
      console.error("Error updating user points:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar pontos do utilizador");
    }
  }

  // Update user bets_visibility
  async updateUserBetsVisibility(req: Request<{ id: string }, {}, UpdateUserBetsVisibilityRequest>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { bets_visibility } = req.body;
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }

      if (typeof bets_visibility !== 'boolean' || (bets_visibility !== false && bets_visibility !== true)) {
        ResponseHelper.badRequest(res, "Visibilidade de apostas deve ser 0 (oculto) ou 1 (visível)");
        return;
      }

      const existingUser = await prisma.users.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `Utilizador com ID ${userId} não encontrado`);
        return;
      }
      
      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: { bets_visibility }
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      ResponseHelper.success(res, userWithoutPassword, "Visibilidade de apostas do utilizador atualizada com sucesso");
    } catch (error) {
      console.error("Error updating user bets visibility:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar visibilidade de apostas do utilizador");
    }
  }

  // Update user tutorial_verification
  async updateUserTutorialVerification(req: Request<{ id: string }, {}, UpdateUserTutorialVerificationRequest>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { tutorial_verification } = req.body;
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }

      if (typeof tutorial_verification !== 'boolean' || (tutorial_verification !== false && tutorial_verification !== true)) {
        ResponseHelper.badRequest(res, "Verificação do tutorial deve ser 0 ou 1");
        return;
      }

      const existingUser = await prisma.users.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `Utilizador com ID ${userId} não encontrado`);
        return;
      }

      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: { tutorial_verification }
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      ResponseHelper.success(res, userWithoutPassword, "Verificação do tutorial do utilizador atualizada com sucesso");
    } catch (error) {
      console.error("Error updating user tutorial verification:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar verificação do tutorial do utilizador");
    }
  }

  // Get leaderboard (users ordered by points)
  async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const leaderboard = await prisma.users.findMany({
        select: {
          id_user: true,
          name: true,
          username: true,
          points: true,
          image: true
        },
        orderBy: { points: 'desc' }
      });

      ResponseHelper.success(res, leaderboard, "Tabela de classificação obtida com sucesso");
    } catch (error) {
      ResponseHelper.serverError(res, "Falha ao obter tabela de classificação");
    }
  }

  // get user position in leaderboard
  async getUserPositionInLeaderboard(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const tokenUserId = parseInt(req.userId!); 

      if (!tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }
      const leaderboard = await prisma.users.findMany({
        select: {
          id_user: true,
          name: true,
          username: true,
          points: true,
          image: true
        },
        orderBy: { points: 'desc' }
      });
      const userPosition = leaderboard.findIndex(user => user.id_user === userId) + 1;
      ResponseHelper.success(res, userPosition, "Tabela de classificação obtida com sucesso");

    } catch (error) {
      ResponseHelper.serverError(res, "Falha ao obter posição do utilizador na tabela de classificação");
    }
  }

}