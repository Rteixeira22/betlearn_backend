import express from 'express'
import userRoutes from './routes/userRoutes'
import betsRoutes from './routes/betsRoutes'
import tipsRoutes from './routes/tipsRoutes'
import authRoutes from './routes/authRoutes'

const router = express.Router()

router.use('/users', userRoutes)
router.use('/bets', betsRoutes)
router.use('/tips', tipsRoutes)
router.use('/auth', authRoutes)

router.get('/', (req, res) => {
  res.json({ message: 'API is running' })
})

export default router





