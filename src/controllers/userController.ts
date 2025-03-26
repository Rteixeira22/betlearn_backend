import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export class UserController {


    async getallusers(req: Request, res: Response) {
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

  // Get leaderboard (users ordered by points)
  async getLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await prisma.users.findMany({
        orderBy: { points: 'desc' }
      })
      res.json(leaderboard)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leaderboard' })
    }
  }
}

