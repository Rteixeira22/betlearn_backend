import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import axios from "axios";

const prisma = new PrismaClient();

const axiosInstance = axios.create({
  timeout: 5000,
  baseURL: "http://localhost:3000",
});

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
      res.status(500).json({ error: "Failed to fetch bet history" });
    }
  }

  // Count user bets
  async countUserBetsById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      console.log(userId);
      const count = await prisma.bets.count({
        where: { ref_id_user: userId },
      });
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to count bets" });
    }
  }

  async getBetsByDate(req: Request, res: Response) {
    try {
      const bets = await prisma.bets.count(); // contar todas as bets, sem filtro
  
      res.json({ count: bets });
    } catch (error) {
      console.error("Erro ao buscar total de apostas:", error);
      res.status(500).json({ error: "Failed to fetch total bets" });
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

  //Get last bet by user ID
  async getLastUserBets(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const bet = await prisma.bets.findFirst({
        where: { ref_id_user: userId },
        orderBy: { date: "desc" },
      });
      res.json(bet);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch last bet" });
    }
  }

  // Create a new bet
  async createBet(req: Request, res: Response) {
    const transaction = await prisma.$transaction(async (prisma: any) => {
      try {
        const {
          type,
          amount,
          potential_earning,
          odd_bet,
          ref,
          state,
          result,
          // Game data
          local_team,
          visitor_team,
          schedule,
          betted_team,
          odd_game,
          goals_local_team,
          goals_visitor_team,
          image,
          game_state,
        } = req.body;

        const ref_id_user = parseInt(req.params.id_user);
        const ref_id_championship = parseInt(req.params.id_championship);

        // Create the game
        const gameResponse = await axiosInstance.post("/api/games/", {
          local_team,
          visitor_team,
          schedule,
          betted_team,
          odd: Number(odd_game),
          goals_local_team: goals_local_team || 0,
          goals_visitor_team: goals_visitor_team || 0,
          image: image || "",
          game_state: game_state || 0,
        });

        const ref_id_game = gameResponse.data.id_game;

        // Create the bet
        const bet = await prisma.bets.create({
          data: {
            date: new Date(),
            type,
            amount: Number(amount),
            potential_earning: Number(potential_earning),
            odd: Number(odd_bet),
            ref,
            state,
            result,
            ref_id_user,
          },
        });

        const ref_id_bets = bet.id_bets;

        // Create the relationship between bet, game and championship
        const betsHasGames = await prisma.bets_has_Games.create({
          data: {
            ref_id_game,
            ref_id_bet: ref_id_bets,
            ref_id_championship,
          },
        });

        return {
          bet,
          game: gameResponse.data,
          betsHasGames,
        };
      } catch (error) {
        console.error("Error in bet creation process:", error);
        throw error;
      }
    });

    try {
      res.status(201).json(transaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Failed to create bet and game relation",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Update bet state and result by ID
  async updateBet(req: Request, res: Response) {
    try {
      const id_bets = Number(req.params.id);

      const { state, result } = req.body;

      const bet = await prisma.bets.update({
        where: { id_bets: id_bets },
        data: {
          state,
          result,
        },
      });

      res.json(bet);
    } catch (error) {
      console.error("Error updating bet:", error);
      res.status(500).json({ error: "Failed to update bet" });
    }
  }

  // Delete bet by ID
  async deleteBet(req: Request, res: Response) {
    try {
      const id_bets = Number(req.params.id);
      const bet = await prisma.bets.delete({
        where: { id_bets: id_bets },
      });
      res.json(bet);
    } catch (error) {
      console.error("Error deleting bet:", error);
      res.status(500).json({ error: "Failed to delete bet" });
    }
  }
}
