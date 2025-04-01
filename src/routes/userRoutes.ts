import express from 'express'
import { UserController } from '../controllers/userController'

const router = express.Router()
const userController = new UserController()


// USER ROUTES

// Get all users
router.get('/', userController.getAllusers)

// User Profile Routes
router.get('/:id', userController.getUserById)
router.get('/username/:username', userController.getUserByUsername)
router.get('/email/:email', userController.getUserByEmail)

// User Profile Update Routes

router.patch('/:id/password', userController.updateUserPassword)
router.patch('/:id/profile', userController.updateUserProfile)
                                                                                                    //esta como string          
router.patch('/:id/money', userController.updateUserMoney)
router.patch('/:id/points', userController.updateUserPoints)
router.patch('/:id/bets-visibility', userController.updateUserBetsVisibility)
router.patch('/:id/tuturial-verification', userController.updateUserTutorialVerification)



// User management routes
router.post('/', userController.createUser) //aqui ele tem de levar todos os parametros porque nenhum esta default  - garantir que username, email não existem no frontend, para nao dar erro
router.delete('/:id', userController.deleteUser)



//CHALLENGES ROUTES


router.get('/:id/challenges', userController.getUserChallenges)

// Bet Routes
router.get('/:id/bets', userController.getUserBetHistory)
router.get('/:id/bets/active', userController.getActiveBets)
router.get('/:id/bets/closed', userController.getClosedBets)
router.get('/:id/bets/won', userController.getWonBets)
router.get('/:id/bets/lost', userController.getLostBets)

// Leaderboard
router.get('/classification/all', userController.getLeaderboard) // fiz com all no final para nao entrar noutra rota, ja que isto devia ter outro controlador e outro ficheiro de rotas

export default router


