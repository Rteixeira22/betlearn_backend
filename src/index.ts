import express from 'express';
import userRoutes from './routes/userRoutes';
import betsRoutes from './routes/betsRoutes';
import tipsRoutes from './routes/tipsRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/bets', betsRoutes);
router.use('/tips', tipsRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

export default router;