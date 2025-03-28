import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class BetsController {
    // Get bets by user ID
    async getBetsByUserId(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const bets = await prisma.bets.findMany({
                where: { ref_id_user: userId },
            });
            res.json(bets);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch bet history' });
        }
    }

    // Get active user bets
/*     async getActiveUserBets(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const bets = await prisma.bets.findMany({
                where: {
                    ref_id_user: userId,
                    state: 0, // Assuming 0 means active
                },
            });
            res.json(bets);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch active bets' });
        }
    }  */

    // Get concluded user bets
    /* async getConcludedUserBets(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const bets = await prisma.bets.findMany({
                where: {
                    ref_id_user: userId,
                    state: 1, // Assuming 1 means concluded
                },
            });
            res.json(bets);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch concluded bets' });
        }
    }  */

    // Get winning user bets
    /* async getWinningUserBets(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const bets = await prisma.bets.findMany({
                where: {
                    ref_id_user: userId,
                    state: 1, // Assuming 1 means concluded
                    result: 1, // Assuming 1 means winning
                },
            });
            res.json(bets);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch winning bets' });
        }
    }  */

    // Get losing user bets
     /* async getLosingUserBets(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const bets = await prisma.bets.findMany({
                where: {
                    ref_id_user: userId,
                    state: 1, // Assuming 1 means concluded
                    result: 0, // Assuming 0 means losing
                },
            });
            res.json(bets);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch losing bets' });
        }
    }  */

    // Get last bet by user ID
    async getLastUserBets(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const bet = await prisma.bets.findFirst({
                where: { ref_id_user: userId },
                orderBy: { date: 'desc' },
            });
            res.json(bet);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch last bet' });
        }
    }

    // Create a new bet
    async createBet(req: Request, res: Response) {
        try {
            const {
                date,
                type,
                amount,
                potential_earning,
                odd,
                ref,
                state,
                result,
            } = req.body;

            const ref_id_user = parseInt(req.params.id);

            if (!date || !type || !amount || !ref_id_user) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const bet = await prisma.bets.create({
                data: {
                    date: new Date(date),
                    type,
                    amount: Number(amount),
                    potential_earning: Number(potential_earning),
                    odd: Number(odd),
                    ref,
                    state,
                    result,
                    ref_id_user: ref_id_user,
                },
            });

            res.status(201).json(bet);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: 'Failed to create bet',
                details: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    // Update bet state and result by ID
    async updateBet(req: Request, res: Response) {
        try {
            const id_bets = Number(req.params.id);

            if (isNaN(id_bets)) {
                return res.status(400).json({ error: 'Invalid bet ID' });
            }

            const { state, result } = req.body;

            if (!state || !result) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const bet = await prisma.bets.update({
                where: { id_bets },
                data: {
                    state,
                    result,
                },
            });

            res.json(bet);
        } catch (error) {
            console.error('Error updating bet:', error);
            res.status(500).json({ error: 'Failed to update bet' });
        }
    }
}