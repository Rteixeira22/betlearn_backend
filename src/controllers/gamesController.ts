import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { 
  ResponseHelper, 
  Game, 
  CreateGameRequest, 
  UpdateGameStateResponse,
  MostBettedGameResponse 
} from "../utils/gamesResponseHelper";

const prisma = new PrismaClient();

export class GamesController {
  // Get all games
  async getAllGames(req: Request, res: Response): Promise<void> {
    try {
      const gamesRaw = await prisma.games.findMany({
        orderBy: {
          id_game: 'desc'
        }
      });

      const games: Game[] = gamesRaw.map(game => ({
        id_game: game.id_game!,
        local_team: game.local_team!,
        visitor_team: game.visitor_team!,
        schedule: game.schedule!,
        betted_team: game.betted_team,
        odd: game.odd !== null && game.odd !== undefined ? Number(game.odd) : undefined,
        goals_local_team: game.goals_local_team,
        goals_visitor_team: game.goals_visitor_team,
        image: game.image,
        game_state: game.game_state!
      }));

      ResponseHelper.success(res, games, "Games retrieved successfully");
    } catch (error) {
      console.error("Error fetching games:", error);
      ResponseHelper.serverError(res, "Failed to fetch games");
    }
  }

  // Get game by ID
  async getGameById(req: Request, res: Response): Promise<void> {
    try {
      const gameId: number = parseInt(req.params.id);

      if (isNaN(gameId) || gameId <= 0) {
        ResponseHelper.badRequest(res, "Invalid game ID format");
        return;
      }

      const gameRaw = await prisma.games.findUnique({
        where: { id_game: gameId },
      });

      if (!gameRaw) {
        ResponseHelper.notFound(res, `Game with ID ${gameId} not found`);
        return;
      }

      const game: Game = {
        id_game: gameRaw.id_game!,
        local_team: gameRaw.local_team!,
        visitor_team: gameRaw.visitor_team!,
        schedule: gameRaw.schedule!,
        betted_team: gameRaw.betted_team,
        odd: gameRaw.odd !== null && gameRaw.odd !== undefined ? Number(gameRaw.odd) : undefined,
        goals_local_team: gameRaw.goals_local_team,
        goals_visitor_team: gameRaw.goals_visitor_team,
        image: gameRaw.image,
        game_state: gameRaw.game_state!
      };

      ResponseHelper.success(res, game, "Game retrieved successfully");
    } catch (error) {
      console.error("Error fetching game:", error);
      ResponseHelper.serverError(res, "Failed to fetch game");
    }
  }

  // Create game
  async createGame(req: Request<{}, {}, CreateGameRequest>, res: Response): Promise<void> {
    try {
      const {
        local_team,
        visitor_team,
        schedule,
        betted_team,
        odd,
        goals_local_team,
        goals_visitor_team,
        image,
        game_state,
      }: CreateGameRequest = req.body;

      // Validate required fields
      if (!local_team || typeof local_team !== 'string' || local_team.trim().length === 0) {
        ResponseHelper.badRequest(res, "Local team is required and must be a non-empty string");
        return;
      }

      if (!visitor_team || typeof visitor_team !== 'string' || visitor_team.trim().length === 0) {
        ResponseHelper.badRequest(res, "Visitor team is required and must be a non-empty string");
        return;
      }

      if (!schedule) {
        ResponseHelper.badRequest(res, "Schedule is required");
        return;
      }

      // Validate schedule format
      const scheduleDate = new Date(schedule);
      if (isNaN(scheduleDate.getTime())) {
        ResponseHelper.badRequest(res, "Invalid schedule date format");
        return;
      }

      // Validate optional numeric fields
      if (odd !== undefined && (typeof odd !== 'number' || odd < 0)) {
        ResponseHelper.badRequest(res, "Odd must be a positive number");
        return;
      }

      if (goals_local_team !== undefined && (typeof goals_local_team !== 'number' || goals_local_team < 0)) {
        ResponseHelper.badRequest(res, "Goals local team must be a non-negative number");
        return;
      }

      if (goals_visitor_team !== undefined && (typeof goals_visitor_team !== 'number' || goals_visitor_team < 0)) {
        ResponseHelper.badRequest(res, "Goals visitor team must be a non-negative number");
        return;
      }

      if (game_state !== undefined && (typeof game_state !== 'number' || (game_state !== 0 && game_state !== 1))) {
        ResponseHelper.badRequest(res, "Game state must be 0 (active) or 1 (finished)");
        return;
      }

      const newGameRaw = await prisma.games.create({
        data: {
          local_team: local_team.trim(),
          visitor_team: visitor_team.trim(),
          schedule: scheduleDate,
          betted_team,
          odd,
          goals_local_team,
          goals_visitor_team,
          image,
          game_state: game_state ?? 0,
        },
      });

      const newGame: Game = {
        id_game: newGameRaw.id_game!,
        local_team: newGameRaw.local_team!,
        visitor_team: newGameRaw.visitor_team!,
        schedule: newGameRaw.schedule!,
        betted_team: newGameRaw.betted_team,
        odd: newGameRaw.odd !== null && newGameRaw.odd !== undefined ? Number(newGameRaw.odd) : undefined,
        goals_local_team: newGameRaw.goals_local_team,
        goals_visitor_team: newGameRaw.goals_visitor_team,
        image: newGameRaw.image,
        game_state: newGameRaw.game_state!
      };

      ResponseHelper.created(res, newGame, "Game created successfully");
    } catch (error) {
      console.error("Error creating game:", error);
      ResponseHelper.serverError(res, "Failed to create game");
    }
  }

  // Update game state
  async updateGameState(req: Request<{ id: string; betId: string }>, res: Response): Promise<void> {
    try {
      const gameId: number = parseInt(req.params.id);
      const betId: number = parseInt(req.params.betId);

      if (isNaN(gameId) || gameId <= 0) {
        ResponseHelper.badRequest(res, "Invalid game ID format");
        return;
      }

      if (isNaN(betId) || betId <= 0) {
        ResponseHelper.badRequest(res, "Invalid bet ID format");
        return;
      }

      // Check if game exists
      const existingGame = await prisma.games.findUnique({
        where: { id_game: gameId },
      });

      if (!existingGame) {
        ResponseHelper.notFound(res, `Game with ID ${gameId} not found`);
        return;
      }

      // Check if bet exists
      const existingBet = await prisma.bets.findUnique({
        where: { id_bets: betId },
      });

      if (!existingBet) {
        ResponseHelper.notFound(res, `Bet with ID ${betId} not found`);
        return;
      }

      // Count games for this bet
      const betsHasGames = await prisma.bets_has_Games.count({
        where: {
          ref_id_bet: betId,
        },
      });

      // If only one game for this bet
      if (betsHasGames === 1) {
        const updatedSingleGame = await prisma.games.update({
          where: { id_game: gameId },
          data: { game_state: 1 },
        });

        const updatedBet = await prisma.bets.update({
          where: { id_bets: betId },
          data: { state: 1 },
        });

        const response: UpdateGameStateResponse = {
          game: {
            id_game: updatedSingleGame.id_game!,
            local_team: updatedSingleGame.local_team!,
            visitor_team: updatedSingleGame.visitor_team!,
            schedule: updatedSingleGame.schedule!,
            betted_team: updatedSingleGame.betted_team,
            odd: updatedSingleGame.odd !== null && updatedSingleGame.odd !== undefined ? Number(updatedSingleGame.odd) : undefined,
            goals_local_team: updatedSingleGame.goals_local_team,
            goals_visitor_team: updatedSingleGame.goals_visitor_team,
            image: updatedSingleGame.image,
            game_state: updatedSingleGame.game_state!
          },
          bet_updated: true,
          unfinished_games_count: 0
        };

        ResponseHelper.success(res, response, "Game and bet state updated successfully");
        return;
      }

      // If multiple games for this bet
      if (betsHasGames > 1) {
        const betsWithUnfinishedGames = await prisma.games.count({
          where: {
            game_state: 0,
            BetsHasGames: {
              some: {
                ref_id_bet: betId,
              },
            },
          },
        });

        // If only one unfinished game (the current one)
        if (betsWithUnfinishedGames === 1) {
          const updatedExactGame = await prisma.games.update({
            where: { id_game: gameId },
            data: { game_state: 1 },
          });

          const updateBetState = await prisma.bets.update({
            where: { id_bets: betId },
            data: { state: 1 },
          });

          const response: UpdateGameStateResponse = {
            game: {
              id_game: updatedExactGame.id_game!,
              local_team: updatedExactGame.local_team!,
              visitor_team: updatedExactGame.visitor_team!,
              schedule: updatedExactGame.schedule!,
              betted_team: updatedExactGame.betted_team,
              odd: updatedExactGame.odd !== null && updatedExactGame.odd !== undefined ? Number(updatedExactGame.odd) : undefined,
              goals_local_team: updatedExactGame.goals_local_team,
              goals_visitor_team: updatedExactGame.goals_visitor_team,
              image: updatedExactGame.image,
              game_state: updatedExactGame.game_state!
            },
            bet_updated: true,
            unfinished_games_count: 0
          };

          ResponseHelper.success(res, response, "Game and bet state updated successfully");
        } else {
          // Multiple unfinished games remain
          const updatedExactGame = await prisma.games.update({
            where: { id_game: gameId },
            data: { game_state: 1 },
          });

          const response: UpdateGameStateResponse = {
            game: {
              id_game: updatedExactGame.id_game!,
              local_team: updatedExactGame.local_team!,
              visitor_team: updatedExactGame.visitor_team!,
              schedule: updatedExactGame.schedule!,
              betted_team: updatedExactGame.betted_team,
              odd: updatedExactGame.odd !== null && updatedExactGame.odd !== undefined ? Number(updatedExactGame.odd) : undefined,
              goals_local_team: updatedExactGame.goals_local_team,
              goals_visitor_team: updatedExactGame.goals_visitor_team,
              image: updatedExactGame.image,
              game_state: updatedExactGame.game_state!
            },
            bet_updated: false,
            unfinished_games_count: betsWithUnfinishedGames - 1
          };

          ResponseHelper.success(res, response, "Game state updated successfully");
        }
      }
    } catch (error) {
      console.error("Error updating game state:", error);
      ResponseHelper.serverError(res, "Failed to update game state");
    }
  }

  // Delete game
  async deleteGame(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const gameId: number = parseInt(req.params.id);

      if (isNaN(gameId) || gameId <= 0) {
        ResponseHelper.badRequest(res, "Invalid game ID format");
        return;
      }

      const existingGame = await prisma.games.findUnique({
        where: { id_game: gameId },
      });

      if (!existingGame) {
        ResponseHelper.notFound(res, `Game with ID ${gameId} not found`);
        return;
      }

      await prisma.games.delete({
        where: { id_game: gameId },
      });

      ResponseHelper.success(res, null, "Game deleted successfully");
    } catch (error) {
      console.error("Error deleting game:", error);
      ResponseHelper.serverError(res, "Failed to delete game");
    }
  }

  // Get most betted game of the day
  async getMostBettedGameOfDay(req: Request, res: Response): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const bettedGames = await prisma.games.findMany({
        select: {
          id_game: true,
          local_team: true,
          visitor_team: true,
          schedule: true,
          betted_team: true,
          odd: true,
          goals_local_team: true,
          goals_visitor_team: true,
          image: true,
          game_state: true,
          BetsHasGames: {
            select: {
              championship: {
                select: {
                  json: true,
                },
              },
              bet: true,
            },
            where: {
              bet: {
                date: {
                  gte: today,
                  lt: tomorrow,
                },
              },
            },
          },
        },
      });
      
      if (bettedGames.length === 0) {
        ResponseHelper.notFound(res, "No bets found for today");
        return;
      }

      const gamesWithCounts = bettedGames.map(game => ({
        id_game: game.id_game!,
        local_team: game.local_team!,
        visitor_team: game.visitor_team!,
        schedule: game.schedule!,
        betted_team: game.betted_team,
        odd: game.odd,
        goals_local_team: game.goals_local_team,
        goals_visitor_team: game.goals_visitor_team,
        image: game.image,
        game_state: game.game_state!,
        bet_count: game.BetsHasGames.length,
        championship_json: game.BetsHasGames[0]?.championship.json || null,
      })).sort((a, b) => b.bet_count - a.bet_count);
      
      const mostBettedGame = gamesWithCounts[0];

      if (!mostBettedGame) {
        ResponseHelper.notFound(res, "No bets found for today");
        return;
      }

      const response: MostBettedGameResponse = {
        game: {
          id_game: mostBettedGame.id_game,
          local_team: mostBettedGame.local_team,
          visitor_team: mostBettedGame.visitor_team,
          schedule: mostBettedGame.schedule,
          betted_team: mostBettedGame.betted_team,
          odd: mostBettedGame.odd !== null && mostBettedGame.odd !== undefined ? Number(mostBettedGame.odd) : undefined,
          goals_local_team: mostBettedGame.goals_local_team,
          goals_visitor_team: mostBettedGame.goals_visitor_team,
          image: mostBettedGame.image,
          game_state: mostBettedGame.game_state
        },
        bet_count: mostBettedGame.bet_count,
        championship_json: mostBettedGame.championship_json
      };

      ResponseHelper.success(res, response, "Most betted game of the day retrieved successfully");
    } catch (error) {
      console.error("Error fetching most betted game:", error);
      ResponseHelper.serverError(res, "Failed to fetch most betted game of the day");
    }
  }
}