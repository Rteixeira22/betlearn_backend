import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class ChampionsController {
  //IR BUSCRAR TODOS OS CAMPEONATOS
  async getAllChampionships(req: Request, res: Response) {
    try {
      const championships = await prisma.championship.findMany({
        orderBy: {
          creation_date: 'desc', 
          
        },
      });
  
      res.status(200).json(championships);
    } catch (error) {
      res.status(500).json({ error: "Erro ao procurar todos os campeonatos." });
    }
  }

  async getYesterdayChampionship(req: Request, res: Response) {
    try {
      // Calcula a data de ontem
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      // Define o início e o fim do dia de ontem
      const startOfYesterday = new Date(yesterday);
      startOfYesterday.setHours(0, 0, 0, 0);
      
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      
      const championship = await prisma.championship.findFirst({
        where: {
          creation_date: {
            gte: startOfYesterday,
            lte: endOfYesterday
          }
        },
        orderBy: {
          creation_date: 'desc'
        }
      });
      
      if (!championship) {
        return res.status(404).json({ error: "Nenhum campeonato encontrado para ontem." });
      }
      
      res.status(200).json(championship);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar o campeonato de ontem." });
    }
  }

  //IR BUSCAR UM CAMPEONATO PELO ID
  async getChampionshipById(req: Request, res: Response) {
    try {
      const championshipId = parseInt(req.params.id);

      //SAVE
      const championship = await prisma.championship.findUnique({
        where: { id_championship: championshipId },
      });

      //ENVIAR
      res.status(200).json(championship);
    } catch (error) {
      res.status(500).json({ error: "Erro ao procurar campeonato." });
    }
  }

  //CRIAR UM CAMPEONATO
  async createChampionship(req: Request, res: Response) {
    try {
      const { json } = req.body;
      //SAVE
      const championship = await prisma.championship.create({
        data: {
          json,
        },
      });

      //ENVIAR
      res.status(200).json(championship);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar campeonato." });
    }
  }

  //ATUALIZAR UM CAMPEONATO
  async updateChampionship(req: Request, res: Response) {
    try {
      //ID DO CAMPEONATO
      const championshipId = parseInt(req.params.id);

      //NOVOS DADOS
      const { json } = req.body;

      //SAVE
      const updatedChampionship = await prisma.championship.update({
        where: { id_championship: championshipId },
        data: { json },
      });

      //ENVIAR
      res.status(200).json(updatedChampionship);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar campeonato." });
    }
  }

  //APAGAR UM CAMPEONATO
  async deleteChampionship(req: Request, res: Response) {
    try {
      //ID DO CAMPEONATO
      const championshipId = parseInt(req.params.id);

      //DELETE
      const deletedChampionship = await prisma.championship.delete({
        where: { id_championship: championshipId },
      });

      //ENVIAR
      res.status(200).json(deletedChampionship);
    } catch (error) {
      res.status(500).json({ error: "Erro ao apagado campeonato." });
    }
  }
}
