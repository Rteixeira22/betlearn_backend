import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { 
  Championship, 
  CreateChampionshipRequest, 
  UpdateChampionshipRequest 
} from "../utils/championshipsDataType";

import { 
  ResponseHelper, 
} from "../utils/responseHelper";

import { retryWithFixes } from "../scripts/getDataFromAI";

const prisma = new PrismaClient();

export class ChampionsController {
  // Get all championships
  async getAllChampionships(req: Request, res: Response): Promise<void> {
    try {
      const championshipsRaw = await prisma.championship.findMany({
        orderBy: {
          creation_date: 'desc', 
        },
      });

      const championships: Championship[] = championshipsRaw.map(championship => ({
        id_championship: championship.id_championship!,
        json: championship.json!,
        creation_date: championship.creation_date!
      }));
  
      ResponseHelper.success(res, championships, "Campeonatos obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching championships:", error);
      ResponseHelper.serverError(res, "Falha ao obter campeonatos");
    }
  }

  // Get last two championships
  async getLastTwoChampionships(req: Request, res: Response): Promise<void> {
    try {
      const championshipsRaw = await prisma.championship.findMany({
        orderBy: {
          creation_date: 'desc',
        },
        take: 2,
      });

      const championships: Championship[] = championshipsRaw.map(championship => ({
        id_championship: championship.id_championship!,
        json: championship.json!,
        creation_date: championship.creation_date!
      }));

      ResponseHelper.success(res, championships, "Últimos dois campeonatos obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching last two championships:", error);
      ResponseHelper.serverError(res, "Falha ao obter os últimos dois campeonatos");
    }
  }

  // Get yesterday's championship
  async getYesterdayChampionship(req: Request, res: Response): Promise<void> {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      const startOfYesterday = new Date(yesterday);
      startOfYesterday.setHours(0, 0, 0, 0);
      
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      
      const championshipRaw = await prisma.championship.findFirst({
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
      
      if (!championshipRaw) {
        ResponseHelper.notFound(res, "Nenhum campeonato encontrado para ontem");
        return;
      }

      const championship: Championship = {
        id_championship: championshipRaw.id_championship!,
        json: championshipRaw.json!,
        creation_date: championshipRaw.creation_date!
      };
      
      ResponseHelper.success(res, championship, "Campeonato de ontem obtido com sucesso");
    } catch (error) {
      console.error("Error fetching yesterday's championship:", error);
      ResponseHelper.serverError(res, "Falha ao obter o campeonato de ontem");
    }
  }

  // Get championship by ID
  async getChampionshipById(req: Request, res: Response): Promise<void> {
    try {
      const championshipId: number = parseInt(req.params.id);

      if (isNaN(championshipId) || championshipId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de campeonato inválido");
        return;
      }

      const championshipRaw = await prisma.championship.findUnique({
        where: { id_championship: championshipId },
      });

      if (!championshipRaw) {
        ResponseHelper.notFound(res, `Campeonato com ID ${championshipId} não encontrado`);
        return;
      }

      const championship: Championship = {
        id_championship: championshipRaw.id_championship!,
        json: championshipRaw.json!,
        creation_date: championshipRaw.creation_date!
      };

      ResponseHelper.success(res, championship, "Campeonato obtido com sucesso");
    } catch (error) {
      console.error("Error fetching championship:", error);
      ResponseHelper.serverError(res, "Falha ao obter campeonato");
    }
  }

  // Create championship
  async createChampionship(req: Request<{}, {}, CreateChampionshipRequest>, res: Response): Promise<void> {
    try {
      const { json }: CreateChampionshipRequest = req.body;

      if (!json) {
        ResponseHelper.badRequest(res, "Dados JSON do campeonato são obrigatórios");
        return;
      }

      if (typeof json !== 'string') {
        ResponseHelper.badRequest(res, "JSON do campeonato deve ser uma string");
        return;
      }

      // Validate JSON format
      try {
        JSON.parse(json);
      } catch (jsonError) {
        ResponseHelper.badRequest(res, "Formato JSON inválido");
        return;
      }

      const championshipRaw = await prisma.championship.create({
        data: {
          json,
        },
      });

      const championship: Championship = {
        id_championship: championshipRaw.id_championship!,
        json: championshipRaw.json!,
        creation_date: championshipRaw.creation_date!
      };

      ResponseHelper.created(res, championship, "Campeonato criado com sucesso");
    } catch (error) {
      console.error("Error creating championship:", error);
      ResponseHelper.serverError(res, "Falha ao criar campeonato");
    }
  }

  // Update championship
  async updateChampionship(req: Request<{ id: string }, {}, UpdateChampionshipRequest>, res: Response): Promise<void> {
    try {
      const championshipId: number = parseInt(req.params.id);
      const { json }: UpdateChampionshipRequest = req.body;

      if (isNaN(championshipId) || championshipId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de campeonato inválido");
        return;
      }

      if (!json) {
        ResponseHelper.badRequest(res, "Dados JSON do campeonato são obrigatórios");
        return;
      }

      if (typeof json !== 'string') {
        ResponseHelper.badRequest(res, "JSON do campeonato deve ser uma string");
        return;
      }

      // Validate JSON format
      try {
        JSON.parse(json);
      } catch (jsonError) {
        ResponseHelper.badRequest(res, "Formato JSON inválido");
        return;
      }

      // Check if championship exists
      const existingChampionship = await prisma.championship.findUnique({
        where: { id_championship: championshipId },
      });

      if (!existingChampionship) {
        ResponseHelper.notFound(res, `Campeonato com ID ${championshipId} não encontrado`);
        return;
      }

      const updatedChampionshipRaw = await prisma.championship.update({
        where: { id_championship: championshipId },
        data: { json },
      });

      const updatedChampionship: Championship = {
        id_championship: updatedChampionshipRaw.id_championship!,
        json: updatedChampionshipRaw.json!,
        creation_date: updatedChampionshipRaw.creation_date!
      };

      ResponseHelper.success(res, updatedChampionship, "Campeonato atualizado com sucesso");
    } catch (error) {
      console.error("Error updating championship:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar campeonato");
    }
  }

  // Delete championship
  async deleteChampionship(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const championshipId: number = parseInt(req.params.id);

      if (isNaN(championshipId) || championshipId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de campeonato inválido");
        return;
      }

      const existingChampionship = await prisma.championship.findUnique({
        where: { id_championship: championshipId },
      });

      if (!existingChampionship) {
        ResponseHelper.notFound(res, `Campeonato com ID ${championshipId} não encontrado`);
        return;
      }

      await prisma.championship.delete({
        where: { id_championship: championshipId },
      });

      ResponseHelper.success(res, null, "Campeonato eliminado com sucesso");
    } catch (error) {
      console.error("Error deleting championship:", error);
      ResponseHelper.serverError(res, "Falha ao eliminar campeonato");
    }
  }

  // Generate championship automatically
  async generateChampionship(req: Request, res: Response): Promise<void> {
    try {
      const championshipData = await retryWithFixes();

      if (!championshipData) {
        ResponseHelper.serverError(res, "Falha ao gerar dados do campeonato");
        return;
      }

      ResponseHelper.success(res, championshipData, "Campeonato gerado com sucesso");
    } catch (error) {
      console.error("Error generating championship:", error);
      ResponseHelper.serverError(res, "Falha ao gerar campeonato");
    }
  }
}