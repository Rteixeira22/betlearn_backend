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
      const requestedId = parseInt(req.params.id);
      
      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
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
        ResponseHelper.badRequest(res, "Valor de limite inválido");
        return;
      }

      if (isNaN(parsedOffset) || parsedOffset < 0) {
        ResponseHelper.badRequest(res, "Valor de offset inválido");
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

      ResponseHelper.success(res, response, "Apostas obtidas com sucesso");
    } catch (error) {
      console.error("Error fetching bets:", error);
      ResponseHelper.serverError(res, "Falha ao obter histórico de apostas");
    }
  }

  // Count user bets
  async countUserBetsById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      const count = await prisma.bets.count({
        where: { ref_id_user: userId },
      });

      const response: BetCountResponse = { count };
      ResponseHelper.success(res, response, "Número de apostas obtido com sucesso");
    } catch (error) {
      console.error("Error counting bets:", error);
      ResponseHelper.serverError(res, "Falha ao contar apostas");
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
      ResponseHelper.success(res, response, "Número de apostas de hoje obtido com sucesso");
    } catch (error) {
      console.error("Error fetching today's bets:", error);
      ResponseHelper.serverError(res, "Falha ao obter apostas de hoje");
    }
  }

  // Get last bet by user ID
  async getLastUserBets(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
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
        ResponseHelper.notFound(res, `Nenhuma aposta encontrada para o utilizador ${userId}`);
        return;
      }

      ResponseHelper.success(res, bet as BetWithGames, "Última aposta obtida com sucesso");
    } catch (error) {
      console.error("Error fetching last bet:", error);
      ResponseHelper.serverError(res, "Falha ao obter a última aposta com dados do jogo");
    }
  }

  // Create a new bet
  async createBet(req: Request<{ id_user: string, id_championship: string }, {}, CreateBetRequest>, res: Response): Promise<void> {
    try {
      const ref_id_user = parseInt(req.params.id_user);
      const ref_id_championship = parseInt(req.params.id_championship);

      if (isNaN(ref_id_user) || ref_id_user <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (isNaN(ref_id_championship) || ref_id_championship <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de campeonato inválido");
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
        ResponseHelper.badRequest(res, "Campos obrigatórios da aposta em falta");
        return;
      }

      if (!local_team || !visitor_team || !schedule || !betted_team || !odd_game) {
        ResponseHelper.badRequest(res, "Campos obrigatórios do jogo em falta");
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
      ResponseHelper.created(res, response, "Aposta criada com sucesso");
    } catch (error) {
      console.error("Error creating bet:", error);
      ResponseHelper.serverError(res, "Falha ao criar aposta e relação com jogo");
    }
  }

  // Update bet state and result by ID
  async updateBet(req: Request<{ id: string }, {}, UpdateBetRequest>, res: Response): Promise<void> {
    try {
      const id_bets = parseInt(req.params.id);

      if (isNaN(id_bets) || id_bets <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de aposta inválido");
        return;
      }

      const { state, result } = req.body;

      // Validate that at least one field is provided
      if (state === undefined && result === undefined) {
        ResponseHelper.badRequest(res, "Pelo menos um campo (estado ou resultado) deve ser fornecido");
        return;
      }

      // Validate state and result values
      if (state !== undefined && (typeof state !== 'number' || (state !== 0 && state !== 1))) {
        ResponseHelper.badRequest(res, "Estado deve ser 0 ou 1");
        return;
      }

      if (result !== undefined && (typeof result !== 'number' || (result !== 0 && result !== 1))) {
        ResponseHelper.badRequest(res, "Resultado deve ser 0 ou 1");
        return;
      }

      // Check if bet exists
      const existingBet = await prisma.bets.findUnique({
        where: { id_bets: id_bets },
      });

      if (!existingBet) {
        ResponseHelper.notFound(res, `Aposta com ID ${id_bets} não encontrada`);
        return;
      }

      const bet = await prisma.bets.update({
        where: { id_bets: id_bets },
        data: {
          ...(state !== undefined && { state }),
          ...(result !== undefined && { result }),
        },
      });

      ResponseHelper.success(res, bet, "Aposta atualizada com sucesso");
    } catch (error) {
      console.error("Error updating bet:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar aposta");
    }
  }

  // Delete bet by ID
  async deleteBet(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const id_bets = parseInt(req.params.id);

      if (isNaN(id_bets) || id_bets <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de aposta inválido");
        return;
      }

      // Check if bet exists
      const existingBet = await prisma.bets.findUnique({
        where: { id_bets: id_bets },
      });

      if (!existingBet) {
        ResponseHelper.notFound(res, `Aposta com ID ${id_bets} não encontrada`);
        return;
      }

      await prisma.bets.delete({
        where: { id_bets: id_bets },
      });

      ResponseHelper.success(res, null, "Aposta eliminada com sucesso");
    } catch (error) {
      console.error("Error deleting bet:", error);
      ResponseHelper.serverError(res, "Falha ao eliminar aposta");
    }
  }
}