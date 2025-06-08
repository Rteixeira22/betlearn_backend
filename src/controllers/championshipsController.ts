import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { 
  ResponseHelper, 
  Championship, 
  CreateChampionshipRequest, 
  UpdateChampionshipRequest 
} from "../utils/championshipsResponseHelper";

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
  
      ResponseHelper.success(res, championships, "Championships retrieved successfully");
    } catch (error) {
      console.error("Error fetching championships:", error);
      ResponseHelper.serverError(res, "Failed to fetch championships");
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

      ResponseHelper.success(res, championships, "Last two championships retrieved successfully");
    } catch (error) {
      console.error("Error fetching last two championships:", error);
      ResponseHelper.serverError(res, "Failed to fetch last two championships");
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
        ResponseHelper.notFound(res, "No championship found for yesterday");
        return;
      }

      const championship: Championship = {
        id_championship: championshipRaw.id_championship!,
        json: championshipRaw.json!,
        creation_date: championshipRaw.creation_date!
      };
      
      ResponseHelper.success(res, championship, "Yesterday's championship retrieved successfully");
    } catch (error) {
      console.error("Error fetching yesterday's championship:", error);
      ResponseHelper.serverError(res, "Failed to fetch yesterday's championship");
    }
  }

  // Get championship by ID
  async getChampionshipById(req: Request, res: Response): Promise<void> {
    try {
      const championshipId: number = parseInt(req.params.id);

      if (isNaN(championshipId) || championshipId <= 0) {
        ResponseHelper.badRequest(res, "Invalid championship ID format");
        return;
      }

      const championshipRaw = await prisma.championship.findUnique({
        where: { id_championship: championshipId },
      });

      if (!championshipRaw) {
        ResponseHelper.notFound(res, `Championship with ID ${championshipId} not found`);
        return;
      }

      const championship: Championship = {
        id_championship: championshipRaw.id_championship!,
        json: championshipRaw.json!,
        creation_date: championshipRaw.creation_date!
      };

      ResponseHelper.success(res, championship, "Championship retrieved successfully");
    } catch (error) {
      console.error("Error fetching championship:", error);
      ResponseHelper.serverError(res, "Failed to fetch championship");
    }
  }

  // Create championship
  async createChampionship(req: Request<{}, {}, CreateChampionshipRequest>, res: Response): Promise<void> {
    try {
      const { json }: CreateChampionshipRequest = req.body;

      if (!json) {
        ResponseHelper.badRequest(res, "Championship JSON data is required");
        return;
      }

      if (typeof json !== 'string') {
        ResponseHelper.badRequest(res, "Championship JSON must be a string");
        return;
      }

      // Validate JSON format
      try {
        JSON.parse(json);
      } catch (jsonError) {
        ResponseHelper.badRequest(res, "Invalid JSON format");
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

      ResponseHelper.created(res, championship, "Championship created successfully");
    } catch (error) {
      console.error("Error creating championship:", error);
      ResponseHelper.serverError(res, "Failed to create championship");
    }
  }

  // Update championship
  async updateChampionship(req: Request<{ id: string }, {}, UpdateChampionshipRequest>, res: Response): Promise<void> {
    try {
      const championshipId: number = parseInt(req.params.id);
      const { json }: UpdateChampionshipRequest = req.body;

      if (isNaN(championshipId) || championshipId <= 0) {
        ResponseHelper.badRequest(res, "Invalid championship ID format");
        return;
      }

      if (!json) {
        ResponseHelper.badRequest(res, "Championship JSON data is required");
        return;
      }

      if (typeof json !== 'string') {
        ResponseHelper.badRequest(res, "Championship JSON must be a string");
        return;
      }

      // Validate JSON format
      try {
        JSON.parse(json);
      } catch (jsonError) {
        ResponseHelper.badRequest(res, "Invalid JSON format");
        return;
      }

      // Check if championship exists
      const existingChampionship = await prisma.championship.findUnique({
        where: { id_championship: championshipId },
      });

      if (!existingChampionship) {
        ResponseHelper.notFound(res, `Championship with ID ${championshipId} not found`);
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

      ResponseHelper.success(res, updatedChampionship, "Championship updated successfully");
    } catch (error) {
      console.error("Error updating championship:", error);
      ResponseHelper.serverError(res, "Failed to update championship");
    }
  }

  // Delete championship
  async deleteChampionship(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const championshipId: number = parseInt(req.params.id);

      if (isNaN(championshipId) || championshipId <= 0) {
        ResponseHelper.badRequest(res, "Invalid championship ID format");
        return;
      }

      const existingChampionship = await prisma.championship.findUnique({
        where: { id_championship: championshipId },
      });

      if (!existingChampionship) {
        ResponseHelper.notFound(res, `Championship with ID ${championshipId} not found`);
        return;
      }

      await prisma.championship.delete({
        where: { id_championship: championshipId },
      });

      ResponseHelper.success(res, null, "Championship deleted successfully");
    } catch (error) {
      console.error("Error deleting championship:", error);
      ResponseHelper.serverError(res, "Failed to delete championship");
    }
  }

  // Generate championship automatically
  async generateChampionship(req: Request, res: Response): Promise<void> {
    try {
      const championshipData = await retryWithFixes();

      if (!championshipData) {
        ResponseHelper.serverError(res, "Failed to generate championship data");
        return;
      }

      ResponseHelper.success(res, championshipData, "Championship generated successfully");
    } catch (error) {
      console.error("Error generating championship:", error);
      ResponseHelper.serverError(res, "Failed to generate championship");
    }
  }
}