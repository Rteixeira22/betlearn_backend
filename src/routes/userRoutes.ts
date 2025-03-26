import express from 'express'
import { UserController } from '../controllers/userController'

const router = express.Router()
const userController = new UserController()

// User Profile Routes
router.get('/', userController.getallusers)
router.get('/:id', userController.getUserById)
router.put('/:id/profile', userController.updateUserProfile)
router.put('/:id/money', userController.updateUserMoney)

// Challenge Routes
router.get('/:id/challenges', userController.getUserChallenges)

// Bet Routes
router.get('/:id/bets', userController.getUserBetHistory)
router.get('/:id/bets/active', userController.getActiveBets)
router.get('/:id/bets/closed', userController.getClosedBets)
router.get('/:id/bets/won', userController.getWonBets)
router.get('/:id/bets/lost', userController.getLostBets)

// Leaderboard
router.get('/leaderboard', userController.getLeaderboard)

export default router

