

import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

export class UserController {


 async getAllusers(req: Request, res: Response) {
        try {
          const users = await prisma.users.findMany()
          res.json(users)
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch users' })

        
    }
}

  // Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const user = await prisma.users.findUnique({
        where: { id_user: userId }
      })
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' })
    }
  }


  // Get user challenges
  async getUserChallenges(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const challenges = await prisma.user_has_Challenges.findMany({
        where: { ref_id_user: userId },
        include: {
          challenge: true
        }
      })
      res.json(challenges)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user challenges' })
    }
  }

  // Get user bet history
  async getUserBetHistory(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const bets = await prisma.bets.findMany({
        where: { ref_id_user: userId }
      })
      res.json(bets)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bet history' })
    }
  }

  // Get active user bets
  async getActiveBets(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const activeBets = await prisma.bets.findMany({
        where: { 
          ref_id_user: userId,
          state: 0 // Assuming 0 represents active bets
        }
      })
      res.json(activeBets)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch active bets' })
    }
  }

  // Get closed bets
  async getClosedBets(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const closedBets = await prisma.bets.findMany({
        where: { 
          ref_id_user: userId,
          state: 1 // Assuming 1 represents closed bets
        }
      })
      res.json(closedBets)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch closed bets' })
    }
  }

  // Get won bets
  async getWonBets(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const wonBets = await prisma.bets.findMany({
        where: { 
          ref_id_user: userId,
          state: 1, // Closed bets
          result: 1 // Won bets
        }
      })
      res.json(wonBets)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch won bets' })
    }
  }

  // Get lost bets
  async getLostBets(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const lostBets = await prisma.bets.findMany({
        where: { 
          ref_id_user: userId,
          state: 1, // Closed bets
          result: 0 // Lost bets
        }
      })
      res.json(lostBets)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch lost bets' })
    }
  }

  //Get user by username
  async getUserByUsername(req: Request, res: Response) {
    try {
      const username = req.params.username
      const user = await prisma.users.findUnique({
        where: { username: username }
      })
      if (!user) {
         res.status(404).json({ error: 'User not found' })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' })
    }
  }
  // Get user by email
  async getUserByEmail(req: Request, res: Response) {
    try {
      const email = req.params.email
      const user = await prisma.users.findUnique({
        where: { email }
      })
      if (!user) {
        res.status(404).json({ error: 'User not found' })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' })
    }
  }

  // Create a new user
  async createUser(req: Request, res: Response) {
    try {
      const { name, email, username, birthdate, password, image, money, points, tutorial_verification } = req.body
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await prisma.users.create({
        data: {
          name,
          email,
          username,
          birthdate: new Date(birthdate),
          password: hashedPassword,
          image,
          money,
          points,
          tutorial_verification,  
        }
      })
      res.status(201).json(newUser)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create user' })
    }
  }



  // Delete a user
  async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      await prisma.users.delete({
        where: { id_user: userId }
      })
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' })
    }
  }
  // Update user password
  async updateUserPassword(req: Request, res: Response) {
    try {
      console.log("Received ID:", req.params.id);
      console.log("Received Body:", req.body);
  
      const userId = Number(req.params.id);
      if (isNaN(userId)) {
         res.status(400).json({ error: "Invalid user ID" });
      }
  
      const { password } = req.body;
      if (!password || password.length < 8) {
         res.status(400).json({ error: "Password must be at least 8 characters long" });
      }
  
      const existingUser = await prisma.users.findUnique({ where: { id_user: userId } });
      if (!existingUser) {
         res.status(404).json({ error: "User not found" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await prisma.users.update({
        where: { id_user: userId },
        data: { password: hashedPassword },
      });
  
      console.log("Password updated successfully for user:", userId);
      res.json({ message: "Password updated successfully" });
    }catch (error) {
        console.error("Password update error:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        res.status(500).json({ error: "Failed to update user password" });
      }
  }
  
  


  // Update user profile
  async updateUserProfile(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const { name, email, username, image } = req.body
      
      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(username && { username }),
          ...(image && { image })
        }
      })
      
      res.json(updatedUser)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user profile' })
    }
  }

  // Update user money
  async updateUserMoney(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const { money } = req.body
      
      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: { money }
      })
      
      res.json(updatedUser)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user money' })
    }
  }

  // Update user points
  async updateUserPoints(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const { points } = req.body
      
      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: { points }
      })
      
      res.json(updatedUser)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user points' })
    }
  }


  //update user bets_visibility
async updateUserBetsVisibility(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id)
    const { bets_visibility } = req.body
    
    const updatedUser = await prisma.users.update({
      where: { id_user: userId },
      data: { bets_visibility }
    })
    
    res.json(updatedUser)
  }
  catch (error) {
    res.status(500).json({ error: 'Failed to update user bets visibility' })
  }
}

//update user tutorial_verification
async updateUserTutorialVerification(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id)
    const { tutorial_verification } = req.body
    const updatedUser = await prisma.users.update({
      where: { id_user: userId },
      data: { tutorial_verification }
    })
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user tutorial verification' })
  }
}



  // Get leaderboard (users ordered by points)
  async getLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await prisma.users.findMany({
        orderBy: { points: 'desc' }
      });
      res.json(leaderboard);
    } catch (error: any) {
      console.error("Erro no getLeaderboard:", error);
      res.status(500).json({ 
        error: 'Erro ao buscar o ranking',
        message: error.message,
        stack: error.stack
      });
    }
  }

  // get user position in leaderboard
  async getUserPositionInLeaderboard(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const leaderboard = await prisma.users.findMany({
        orderBy: { points: 'desc' }
      });
      const userPosition = leaderboard.findIndex(user => user.id_user === userId) + 1;
      res.json({ position: userPosition });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user position in leaderboard' })
    }
  }



}




