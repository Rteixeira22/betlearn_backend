import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

///PRISMA CLIENT
const prisma = new PrismaClient();
export class GamesController {
  //IR BUSCAR TODOS OS JOGOS PARA PODER MOSTRAR NA PAGINA DAS APOSTAS
  async getAllGames(req: Request, res: Response) {
    try {
      //SAVE
      const games = await prisma.games.findMany();
      //ENVIAR
      res.status(200).json(games);
    } catch (error) {
      res.status(500).json({ error: "Erro ao procurar todos os jogos." });
    }
  }

  //IR BUSACR UM JOGO PELO ID
  async getGameById(req: Request, res: Response) {
    try {
      //ID DO JOGO
      const gameId = parseInt(req.params.id);

      //SAVE
      const game = await prisma.games.findUnique({
        where: { id_game: gameId },
      });

      //ENVIAR
      res.status(200).json(game);
    } catch (error) {
      res.status(500).json({ error: "Erro ao procurar o jogo." });
    }
  }

  //CRIAR UM JOGO
  async createGame(req: Request, res: Response) {
    try {
      //DADOS
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
      } = req.body;

      //CRIAR
      const newGame = await prisma.games.create({
        data: {
          local_team,
          visitor_team,
          schedule,
          betted_team,
          odd,
          goals_local_team,
          goals_visitor_team,
          image,
          game_state,
        },
      });
      //ENVIAR
      res.status(200).json(newGame);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar o jogo." });
    }
  }

  //ATUALIZAR O ESTADO DE UM JOGO
  async updateGameState(req: Request, res: Response) {
    try {
      //VAI VER SE HÁ MAIS JOGOS DAQUELA BET
      //USA O ID DO JOGO
      const gameId = parseInt(req.params.id);
      //E O DA BET
      const betId = parseInt(req.params.betId);

      //VAI À BETS_HAS_GAMES E VAI VER SE HÁ MAIS JOGOS DAQUELA BET
      const betsHasGames = await prisma.bets_has_Games.count({
        where: {
          ref_id_bet: betId,
        },
      });

      //SE SÓ HOUVER UM JOGO DAQUELA BET VAI ATUALIZAR O ESTADO DO JOGO E DA BET
      if (betsHasGames === 1) {
        //JOGO CONCLUIDO
        const updatedSingleGame = await prisma.games.update({
          where: { id_game: gameId },
          data: { game_state: 1 },
        });

        //BET CONCLUIDA
        const updatedBet = await prisma.bets.update({
          where: { id_bets: betId },
          data: { state: 1 },
        });

        //ATUALIZA OS DOIS
        res.status(200).json({ updatedSingleGame, updatedBet });
      }

      //SE HOUVER MAIS JOGOS DAQUELA BET
      else if (betsHasGames > 1) {
        //VAI BUSCAR O NÚMERO DE JOGOS DESSA BET COM O STATE A 0
        const betsWithUnfinishedGames = await prisma.games.count({
          where: {
            //JOGO INACABADO
            game_state: 0,

            //OUTRA TABELA
            BetsHasGames: {
              //BET_ID
              some: {
                ref_id_bet: betId,
              },
            },
          },
        });
        res.status(200).json(betsWithUnfinishedGames);

        //SE HOUVER SÓ UM JOGO ATIVO
        if (betsWithUnfinishedGames === 1) {
          //ATUALIZAR O ESTADO DO JOGO
          const updatedExactGame = await prisma.games.update({
            where: { id_game: gameId },
            data: { game_state: 1 },
          });

          //AUALIZAR O ESTADO DA BET
          const updateBetState = await prisma.bets.update({
            where: { id_bets: betId },
            data: { state: 1 },
          });

          //ATUALIZA OS DOIS
          res.status(200).json({ updatedExactGame, updateBetState });
        }

        //SE HOUVER MAIS DE UM JOGO ATIVO
        else {
          //ATUALIZAR O ESTADO DO JOGO
          const updatedExactGame = await prisma.games.update({
            where: { id_game: gameId },
            data: { game_state: 1 },
          });
          res.status(200).json(updatedExactGame);
        }
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar o estado do jogo." });
    }
  }

  //APAGAR UM JOGO BY ID -> FERRAMENTA DE ADMINISTRADOR
  async deleteGame(req: Request, res: Response) {
    try {
      //ID DO JOGO
      const gameId = parseInt(req.params.id);

      //APAGAR O JOGO
      const deletedGame = await prisma.games.delete({
        where: { id_game: gameId },
      });

      //ENVIAR
      res.status(200).json(deletedGame);
    } catch (error) {
      res.status(500).json({ error: "Erro ao apagar o jogo." });
    }
  }

  //JOGO MAIS APOSTADO DO DIA
  async getMostBettedGameOfDay(req: Request, res: Response) {
    try {
      // Obter data atual (apenas o dia)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Procura todos os jogos apostados hoje com contagem
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
      
      // Calcular o jogo com mais apostas
      const gamesWithCounts = bettedGames.map(game => ({
        ...game,
        bet_count: game.BetsHasGames.length,
        championship_json: game.BetsHasGames[0]?.championship.json || null,
      })).sort((a, b) => b.bet_count - a.bet_count);
      
      // Remover a propriedade BetsHasGames do resultado
      const mostBettedGame = gamesWithCounts[0];
      if (mostBettedGame) {
        delete (mostBettedGame.BetsHasGames as unknown as { [key: string]: any })?.BetsHasGames;
      }
  
      if (!mostBettedGame) {
        return res.status(404).json({ 
          message: 'Não foram encontradas apostas para hoje.' 
        });
      }
  
      return res.status(200).json({
        message: 'Jogo mais apostado do dia recuperado com sucesso',
        data: mostBettedGame
      });
      
    } catch (error) {
      console.error('Erro ao procurar jogo mais apostado:', error);
      return res.status(500).json({ 
        message: 'Erro interno do servidor ao procurar o jogo mais apostado' 
      });
    }
  }
}
