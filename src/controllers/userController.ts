
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt';
import { 
  ResponseHelper,
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
} from "../utils/userResponseHelper";

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
      
      ResponseHelper.success(res, users, "Users retrieved successfully");
    } catch (error) {
      console.error("Error fetching users:", error);
      ResponseHelper.serverError(res, "Failed to fetch users");
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
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
        ResponseHelper.notFound(res, `User with ID ${requestedId} not found`);
        return;
      }
      ResponseHelper.success(res, user, "User retrieved successfully");
    } catch (error) {
      console.error("Error fetching user:", error);
      ResponseHelper.serverError(res, "Failed to fetch user data");
    }
  }


  async getOtherUserById(req: Request, res: Response): Promise<void> {
    try {
      const requestedId = parseInt(req.params.id);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
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
        ResponseHelper.notFound(res, `User with ID ${requestedId} not found`);
        return;
      }
      ResponseHelper.success(res, user, "User retrieved successfully");
    } catch (error) {
      console.error("Error fetching user:", error);
      ResponseHelper.serverError(res, "Failed to fetch user data");
    }
  }

  // Get user challenges
  async getUserChallenges(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }
      
      const challenges = await prisma.user_has_Challenges.findMany({
        where: { ref_id_user: requestedId },
        include: {
          challenge: true
        }
      });
      
      ResponseHelper.success(res, challenges, "User challenges retrieved successfully");
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      ResponseHelper.serverError(res, "Failed to fetch user challenges");
    }
  }

  // Get user bet history
  async getUserBetHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }      
      
      const bets = await prisma.bets.findMany({
        where: { ref_id_user: userId },
        orderBy: { date: 'desc' }
      });
      
      ResponseHelper.success(res, bets, "Bet history retrieved successfully");
    } catch (error) {
      console.error("Error fetching bet history:", error);
      ResponseHelper.serverError(res, "Failed to fetch bet history");
    }
  }

  // Get active user bets
  async getActiveBets(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }

      const activeBets = await prisma.bets.findMany({
        where: { 
          ref_id_user: userId,
          state: 0 
        },
        orderBy: { date: 'desc' }
      });
      
      ResponseHelper.success(res, activeBets, "Active bets retrieved successfully");
    } catch (error) {
      console.error("Error fetching active bets:", error);
      ResponseHelper.serverError(res, "Failed to fetch active bets");
    }
  }

  // Get closed bets
  async getClosedBets(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }

      const closedBets = await prisma.bets.findMany({
        where: { 
          ref_id_user: userId,
          state: 1 
        },
        orderBy: { date: 'desc' }
      });
      
      ResponseHelper.success(res, closedBets, "Closed bets retrieved successfully");
    } catch (error) {
      console.error("Error fetching closed bets:", error);
      ResponseHelper.serverError(res, "Failed to fetch closed bets");
    }
  }

  // Get won bets
  async getWonBets(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
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
      
      ResponseHelper.success(res, wonBets, "Won bets retrieved successfully");
    } catch (error) {
      console.error("Error fetching won bets:", error);
      ResponseHelper.serverError(res, "Failed to fetch won bets");
    }
  }

  // Get lost bets
  async getLostBets(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
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
      
      ResponseHelper.success(res, lostBets, "Lost bets retrieved successfully");
    } catch (error) {
      console.error("Error fetching lost bets:", error);
      ResponseHelper.serverError(res, "Failed to fetch lost bets");
    }
  }

  // Get user by username
  async getUserByUsername(req: Request, res: Response): Promise<void> {
    try {
      const username = req.params.username;

      if (!username || username.trim().length === 0) {
        ResponseHelper.badRequest(res, "Username is required");
        return;
      }

      const user = await prisma.users.findUnique({
        where: { username: username }
      });

      if (!user) {
        ResponseHelper.notFound(res, "User not found");
        return;
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      ResponseHelper.success(res, userWithoutPassword, "User retrieved successfully");
    } catch (error) {
      console.error("Error fetching user by username:", error);
      ResponseHelper.serverError(res, "Failed to fetch user");
    }
  }

  // Get user by email
  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;

      if (!email || email.trim().length === 0) {
        ResponseHelper.badRequest(res, "Email is required");
        return;
      }

      const user = await prisma.users.findUnique({
        where: { email }
      });

      if (!user) {
        ResponseHelper.notFound(res, "User not found");
        return;
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      ResponseHelper.success(res, userWithoutPassword, "User retrieved successfully");
    } catch (error) {
      console.error("Error fetching user by email:", error);
      ResponseHelper.serverError(res, "Failed to fetch user");
    }
  }

  // Create a new user
  async createUser(req: Request<{}, {}, CreateUserRequest>, res: Response): Promise<void> {
    try {
      const { name, email, username, birthdate, password, image, money = 0, points = 0, tutorial_verification = false, has_accepted_terms = false } = req.body;

      // Validation
      if (!name || name.trim().length === 0) {
        ResponseHelper.badRequest(res, "Name is required");
        return;
      }

      if (!email || email.trim().length === 0) {
        ResponseHelper.badRequest(res, "Email is required");
        return;
      }

      if (!username || username.trim().length === 0) {
        ResponseHelper.badRequest(res, "Username is required");
        return;
      }

      if (!password || password.length < 8) {
        ResponseHelper.badRequest(res, "Password must be at least 8 characters long");
        return;
      }

      if (!birthdate) {
        ResponseHelper.badRequest(res, "Birthdate is required");
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
          ResponseHelper.conflict(res, "Email already exists");
        } else {
          ResponseHelper.conflict(res, "Username already exists");
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
      ResponseHelper.created(res, userWithoutPassword, "User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      ResponseHelper.serverError(res, "Failed to create user");
    }
  }

  // Delete a user
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }

      const existingUser = await prisma.users.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `User with ID ${userId} not found`);
        return;
      }

      await prisma.users.delete({
        where: { id_user: userId }
      });

      ResponseHelper.success(res, null, "User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      ResponseHelper.serverError(res, "Failed to delete user");
    }
  }

  // Update user password
  async updateUserPassword(req: Request<{ id: string }, {}, UpdateUserPasswordRequest>, res: Response): Promise<void> {
    try {
      const requestedId = parseInt(req.params.id);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      const { password } = req.body;
      if (!password || password.length < 8) {
        ResponseHelper.badRequest(res, "Password must be at least 8 characters long");
        return;
      }

      const existingUser = await prisma.users.findUnique({ 
        where: { id_user: requestedId } 
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `User with ID ${requestedId} not found`);
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.users.update({
        where: { id_user: requestedId },
        data: { password: hashedPassword },
      });

      ResponseHelper.success(res, null, "Password updated successfully");
    } catch (error) {
      console.error("Password update error:", error);
      ResponseHelper.serverError(res, "Failed to update user password");
    }
  }

  // Update user profile
  async updateUserProfile(req: Request<{ id: string }, {}, UpdateUserProfileRequest>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }

      const { name, email, username, image } = req.body;

      // Check if at least one field is provided
      if (!name && !email && !username && !image) {
        ResponseHelper.badRequest(res, "At least one field must be provided for update");
        return;
      }

      const existingUser = await prisma.users.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `User with ID ${userId} not found`);
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
            ResponseHelper.conflict(res, "Email already exists");
          } else {
            ResponseHelper.conflict(res, "Username already exists");
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
      ResponseHelper.success(res, userWithoutPassword, "User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      ResponseHelper.serverError(res, "Failed to update user profile");
    }
  }

  // Update user money
  async updateUserMoney(req: Request<{ id: string }, {}, UpdateUserMoneyRequest>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { money } = req.body;

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (typeof money !== 'number' || money < 0) {
        ResponseHelper.badRequest(res, "Money must be a non-negative number");
        return;
      }

      const existingUser = await prisma.users.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `User with ID ${userId} not found`);
        return;
      }
      
      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: { money }
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      ResponseHelper.success(res, userWithoutPassword, "User money updated successfully");
    } catch (error) {
      console.error("Error updating user money:", error);
      ResponseHelper.serverError(res, "Failed to update user money");
    }
  }

  // Update user points
  async updateUserPoints(req: Request<{ id: string }, {}, UpdateUserPointsRequest>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { points } = req.body;
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }

      if (typeof points !== 'number' || points < 0) {
        ResponseHelper.badRequest(res, "Points must be a non-negative number");
        return;
      }

      const existingUser = await prisma.users.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `User with ID ${userId} not found`);
        return;
      }
      
      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: { points }
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      ResponseHelper.success(res, userWithoutPassword, "User points updated successfully");
    } catch (error) {
      console.error("Error updating user points:", error);
      ResponseHelper.serverError(res, "Failed to update user points");
    }
  }

  // Update user bets_visibility
  async updateUserBetsVisibility(req: Request<{ id: string }, {}, UpdateUserBetsVisibilityRequest>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { bets_visibility } = req.body;
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }

      if (typeof bets_visibility !== 'boolean' || (bets_visibility !== false && bets_visibility !== true)) {
        ResponseHelper.badRequest(res, "Bets visibility must be 0 (hidden) or 1 (visible)");
        return;
      }

      const existingUser = await prisma.users.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `User with ID ${userId} not found`);
        return;
      }
      
      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: { bets_visibility }
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      ResponseHelper.success(res, userWithoutPassword, "User bets visibility updated successfully");
    } catch (error) {
      console.error("Error updating user bets visibility:", error);
      ResponseHelper.serverError(res, "Failed to update user bets visibility");
    }
  }

  // Update user tutorial_verification
  async updateUserTutorialVerification(req: Request<{ id: string }, {}, UpdateUserTutorialVerificationRequest>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { tutorial_verification } = req.body;
      const tokenUserId = parseInt(req.userId!); 

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }

      if (typeof tutorial_verification !== 'boolean' || (tutorial_verification !== false && tutorial_verification !== true)) {
        ResponseHelper.badRequest(res, "Tutorial verification must be 0 or 1");
        return;
      }

      const existingUser = await prisma.users.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        ResponseHelper.notFound(res, `User with ID ${userId} not found`);
        return;
      }

      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: { tutorial_verification }
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      ResponseHelper.success(res, userWithoutPassword, "User tutorial verification updated successfully");
    } catch (error) {
      console.error("Error updating user tutorial verification:", error);
      ResponseHelper.serverError(res, "Failed to update user tutorial verification");
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

      ResponseHelper.success(res, leaderboard, "Leaderboard retrieved successfully");
    } catch (error) {
      ResponseHelper.serverError(res, "Failed to fetch leaderboard");
    }
  }

  // get user position in leaderboard
  async getUserPositionInLeaderboard(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const tokenUserId = parseInt(req.userId!); 

      if (!tokenUserId) {
        res.status(403).json({ error: 'Acesso restrito' });
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
      ResponseHelper.success(res, userPosition, "Leaderboard retrieved successfully");

    } catch (error) {
      ResponseHelper.serverError(res, "Failed to fetch user position in leaderboard");
    }
  }

}




