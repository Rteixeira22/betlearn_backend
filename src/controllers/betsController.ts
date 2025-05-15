import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import axiosInstance from "../configs/axiosConfig";
const prisma = new PrismaClient();

export class BetsController {
  // Get bets by user ID, with optional 'type' filtering
 async getBetsByUserId(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    const { 
      state, 
      result, 
      cursor, 
      limit, 
      offset = 0 
    } = req.query;

    const whereClause: any = { ref_id_user: userId };

    // Filtro por state (0 ou 1)
    if (state === "0" || state === "1") {
      whereClause.state = parseInt(state);
    }

    // Filtro por result (0 ou 1)
    if (result === "0" || result === "1") {
      whereClause.result = parseInt(result);
    }

    // Parsing inputs with type safety
    const parsedLimit = typeof limit === 'string' ? parseInt(limit) : 5;
    const parsedOffset = typeof offset === 'string' ? parseInt(offset) : 0;
    const parsedCursor = cursor ? parseInt(cursor as string) : undefined;

    // Combined pagination approach
    const bets = await prisma.bets.findMany({
      where: {
        ...whereClause,
        ...(parsedCursor ? { id: { lt: parsedCursor } } : {})
      },
      orderBy: {
        date: "desc",
      },
      include: {
        BetsHasGames: {
          include: {
            game: true,
          }
        }
      },
      take: parsedLimit,
      skip: parsedOffset
    });

    // Optional: Get total count for pagination metadata
    const totalCount = await prisma.bets.count({
      where: whereClause
    });

    res.json({
      bets,
      pagination: {
        total: totalCount,
        limit: parsedLimit,
        offset: parsedOffset,
        hasNextPage: totalCount > (parsedOffset + parsedLimit)
      }
    });
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
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); 
      
      const bets = await prisma.bets.count({
        where: {
          date: {
            gte: today,
            lt: tomorrow
          }
        }
      });
      
      res.json({ count: bets });
    } catch (error) {
      console.error("Erro ao ir buscar apostas de hoje:", error);
      res.status(500).json({ error: "Failed to fetch today's bets" });
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
        include: {
          BetsHasGames: {
            include: {
              game: true,
            }
          }
        }
      });
      res.json(bet);
    } catch (error) {
      console.error("Error fetching last bet with game:", error);
      res.status(500).json({ error: "Failed to fetch last bet with game data" });
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
        const gameResponse = await axiosInstance.post("/games/", {
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
