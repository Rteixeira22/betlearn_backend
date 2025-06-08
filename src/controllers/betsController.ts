import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import axiosInstance from "../configs/axiosConfig";
import { 
  ResponseHelper, 
  BetWithGames, 
  CreateBetRequest, 
  UpdateBetRequest, 
  BetFiltersQuery,
  PaginatedBetsResponse,
  BetCountResponse,
  CreateBetTransactionResponse
} from "../utils/betsResponseHelper";

const prisma = new PrismaClient();

export class BetsController {
  // Get bets by user ID, with optional filtering
  async getBetsByUserId(req: Request<{ id: string }, {}, {}, BetFiltersQuery>, res: Response): Promise<void> {
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

      const { 
        state, 
        result, 
        cursor, 
        limit, 
        offset = "0" 
      } = req.query;

      const whereClause: any = { ref_id_user: requestedId };

      // Filter by state (0 or 1)
      if (state === "0" || state === "1") {
        whereClause.state = parseInt(state);
      }

      // Filter by result (0 or 1)
      if (result === "0" || result === "1") {
        whereClause.result = parseInt(result);
      }

      // Parsing inputs with type safety
      const parsedLimit = typeof limit === 'string' ? parseInt(limit) : undefined;
      const parsedOffset = typeof offset === 'string' ? parseInt(offset) : 0;
      const parsedCursor = cursor ? parseInt(cursor as string) : undefined;

      // Validate parsed values
      if (parsedLimit && (isNaN(parsedLimit) || parsedLimit <= 0)) {
        ResponseHelper.badRequest(res, "Invalid limit value");
        return;
      }

      if (isNaN(parsedOffset) || parsedOffset < 0) {
        ResponseHelper.badRequest(res, "Invalid offset value");
        return;
      }

      // Combined pagination approach
      const bets = await prisma.bets.findMany({
        where: {
          ...whereClause,
          ...(parsedCursor ? { id_bets: { lt: parsedCursor } } : {})
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

      // Get total count for pagination metadata
      const totalCount = await prisma.bets.count({
        where: whereClause
      });

      const formattedBets: BetWithGames[] = bets.map((bet: any) => ({
        ...bet,
        BetsHasGames: bet.BetsHasGames.map((bhg: any) => ({
          ...bhg,
          game: {
            ...bhg.game,
            odd: bhg.game.odd.toNumber(), 
          },
        })),
      }));

      const response: PaginatedBetsResponse = {
        bets: formattedBets,
        pagination: {
          total: totalCount,
          limit: parsedLimit,
          offset: parsedOffset,
          hasNextPage: parsedLimit ? totalCount > (parsedOffset + parsedLimit) : false
        }
      };

      ResponseHelper.success(res, response, "Bets retrieved successfully");
    } catch (error) {
      console.error("Error fetching bets:", error);
      ResponseHelper.serverError(res, "Failed to fetch bet history");
    }
  }

  // Count user bets
  async countUserBetsById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      const count = await prisma.bets.count({
        where: { ref_id_user: userId },
      });

      const response: BetCountResponse = { count };
      ResponseHelper.success(res, response, "Bet count retrieved successfully");
    } catch (error) {
      console.error("Error counting bets:", error);
      ResponseHelper.serverError(res, "Failed to count bets");
    }
  }

  // Get today's bets count
  async getBetsByDate(req: Request, res: Response): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); 
      
      const count = await prisma.bets.count({
        where: {
          date: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      const response: BetCountResponse = { count };
      ResponseHelper.success(res, response, "Today's bets count retrieved successfully");
    } catch (error) {
      console.error("Error fetching today's bets:", error);
      ResponseHelper.serverError(res, "Failed to fetch today's bets");
    }
  }

  // Get last bet by user ID
  async getLastUserBets(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }
      

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

      if (!bet) {
        ResponseHelper.notFound(res, `No bets found for user ${userId}`);
        return;
      }

      ResponseHelper.success(res, bet as BetWithGames, "Last bet retrieved successfully");
    } catch (error) {
      console.error("Error fetching last bet:", error);
      ResponseHelper.serverError(res, "Failed to fetch last bet with game data");
    }
  }

  // Create a new bet
  async createBet(req: Request<{ id_user: string, id_championship: string }, {}, CreateBetRequest>, res: Response): Promise<void> {
    try {
      const ref_id_user = parseInt(req.params.id_user);
      const ref_id_championship = parseInt(req.params.id_championship);

      if (isNaN(ref_id_user) || ref_id_user <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (isNaN(ref_id_championship) || ref_id_championship <= 0) {
        ResponseHelper.badRequest(res, "Invalid championship ID format");
        return;
      }

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

      // Validate required fields
      if (!type || !amount || !potential_earning || !odd_bet || state === undefined) {
        ResponseHelper.badRequest(res, "Missing required bet fields");
        return;
      }

      if (!local_team || !visitor_team || !schedule || !betted_team || !odd_game) {
        ResponseHelper.badRequest(res, "Missing required game fields");
        return;
      }

      const transaction = await prisma.$transaction(async (prisma: any) => {
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
      });

      const response: CreateBetTransactionResponse = transaction;
      ResponseHelper.created(res, response, "Bet created successfully");
    } catch (error) {
      console.error("Error creating bet:", error);
      ResponseHelper.serverError(res, "Failed to create bet and game relation");
    }
  }

  // Update bet state and result by ID
  async updateBet(req: Request<{ id: string }, {}, UpdateBetRequest>, res: Response): Promise<void> {
    try {
      const id_bets = parseInt(req.params.id);

      if (isNaN(id_bets) || id_bets <= 0) {
        ResponseHelper.badRequest(res, "Invalid bet ID format");
        return;
      }

      const { state, result } = req.body;

      // Validate that at least one field is provided
      if (state === undefined && result === undefined) {
        ResponseHelper.badRequest(res, "At least one field (state or result) must be provided");
        return;
      }

      // Validate state and result values
      if (state !== undefined && (typeof state !== 'number' || (state !== 0 && state !== 1))) {
        ResponseHelper.badRequest(res, "State must be 0 or 1");
        return;
      }

      if (result !== undefined && (typeof result !== 'number' || (result !== 0 && result !== 1))) {
        ResponseHelper.badRequest(res, "Result must be 0 or 1");
        return;
      }

      // Check if bet exists
      const existingBet = await prisma.bets.findUnique({
        where: { id_bets: id_bets },
      });

      if (!existingBet) {
        ResponseHelper.notFound(res, `Bet with ID ${id_bets} not found`);
        return;
      }

      const bet = await prisma.bets.update({
        where: { id_bets: id_bets },
        data: {
          ...(state !== undefined && { state }),
          ...(result !== undefined && { result }),
        },
      });

      ResponseHelper.success(res, bet, "Bet updated successfully");
    } catch (error) {
      console.error("Error updating bet:", error);
      ResponseHelper.serverError(res, "Failed to update bet");
    }
  }

  // Delete bet by ID
  async deleteBet(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const id_bets = parseInt(req.params.id);

      if (isNaN(id_bets) || id_bets <= 0) {
        ResponseHelper.badRequest(res, "Invalid bet ID format");
        return;
      }

      // Check if bet exists
      const existingBet = await prisma.bets.findUnique({
        where: { id_bets: id_bets },
      });

      if (!existingBet) {
        ResponseHelper.notFound(res, `Bet with ID ${id_bets} not found`);
        return;
      }

      await prisma.bets.delete({
        where: { id_bets: id_bets },
      });

      ResponseHelper.success(res, null, "Bet deleted successfully");
    } catch (error) {
      console.error("Error deleting bet:", error);
      ResponseHelper.serverError(res, "Failed to delete bet");
    }
  }
}