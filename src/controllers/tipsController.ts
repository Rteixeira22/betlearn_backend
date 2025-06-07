import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { 
  ResponseHelper, 
  Tip, 
  CreateTipRequest, 
  UpdateTipRequest, 
  UpdateTipStateRequest 
} from "../utils/ResponseHelper";

const prisma = new PrismaClient();

export class TipsController {
  // Get all tips
  async getTips(req: Request, res: Response): Promise<Response> {
    try {
      const tipsRaw = await prisma.tips.findMany({
        orderBy: {
          id_tip: 'desc'
        }
      });

      const tips: Tip[] = tipsRaw.map(tip => ({
        ...tip,
        active: tip.active ?? 0
      }));
      
      return ResponseHelper.success(res, tips, "Tips retrieved successfully");
    } catch (error) {
      console.error("Error fetching tips:", error);
      return ResponseHelper.serverError(res, "Failed to fetch tips");
    }
  }

  // Get tip by ID
  async getTipById(req: Request, res: Response): Promise<Response> {
    try {
      const tipId: number = parseInt(req.params.id);
      
      if (isNaN(tipId) || tipId <= 0) {
        return ResponseHelper.badRequest(res, "Invalid tip ID format");
      }

      const tipRaw = await prisma.tips.findUnique({
        where: { id_tip: tipId },
      });

      if (!tipRaw) {
        return ResponseHelper.notFound(res, `Tip with ID ${tipId} not found`);
      }

      const tip: Tip = {
        ...tipRaw,
        active: tipRaw.active ?? 0
      };

      return ResponseHelper.success(res, tip, "Tip retrieved successfully");
    } catch (error) {
      console.error("Error fetching tip:", error);
      return ResponseHelper.serverError(res, "Failed to fetch tip");
    }
  }

  // Get currently active tip
  async getActiveTip(req: Request, res: Response): Promise<Response> {
    try {
      const tipRaw = await prisma.tips.findFirst({
        where: { active: 1 },
      });

      if (!tipRaw) {
        return ResponseHelper.notFound(res, "No active tip found");
      }

      const tip: Tip = {
        ...tipRaw,
        active: tipRaw.active ?? 0
      };

      return ResponseHelper.success(res, tip, "Active tip retrieved successfully");
    } catch (error) {
      console.error("Error fetching active tip:", error);
      return ResponseHelper.serverError(res, "Failed to fetch active tip");
    }
  }

  // Create new tip
  async createTip(req: Request<{}, {}, CreateTipRequest>, res: Response): Promise<Response> {
    try {
      const { tip }: CreateTipRequest = req.body;

      if (!tip) {
        return ResponseHelper.badRequest(res, "Tip content is required");
      }

      if (typeof tip !== 'string') {
        return ResponseHelper.badRequest(res, "Tip content must be a string");
      }

      if (tip.trim().length === 0) {
        return ResponseHelper.badRequest(res, "Tip content cannot be empty");
      }

      if (tip.trim().length > 1000) {
        return ResponseHelper.badRequest(res, "Tip content is too long (max 1000 characters)");
      }

      const newTipRaw = await prisma.tips.create({
        data: {
          tip: tip.trim(),
          active: 0, 
        },
      });

      const newTip: Tip = {
        ...newTipRaw,
        active: newTipRaw.active ?? 0
      };

      return ResponseHelper.created(res, newTip, "Tip created successfully");
    } catch (error) {
      console.error("Error creating tip:", error);
      return ResponseHelper.serverError(res, "Failed to create tip");
    }
  }

  // Update tip content
  async updateTip(req: Request<{ id: string }, {}, UpdateTipRequest>, res: Response): Promise<Response> {
    try {
      const tipId: number = parseInt(req.params.id);
      const { tip }: UpdateTipRequest = req.body;

      if (isNaN(tipId) || tipId <= 0) {
        return ResponseHelper.badRequest(res, "Invalid tip ID format");
      }

      if (!tip) {
        return ResponseHelper.badRequest(res, "Tip content is required");
      }

      if (typeof tip !== 'string') {
        return ResponseHelper.badRequest(res, "Tip content must be a string");
      }

      if (tip.trim().length === 0) {
        return ResponseHelper.badRequest(res, "Tip content cannot be empty");
      }

      if (tip.trim().length > 1000) {
        return ResponseHelper.badRequest(res, "Tip content is too long (max 1000 characters)");
      }

      const existingTipRaw = await prisma.tips.findUnique({
        where: { id_tip: tipId },
      });

      if (!existingTipRaw) {
        return ResponseHelper.notFound(res, `Tip with ID ${tipId} not found`);
      }

      const existingTip: Tip = {
        ...existingTipRaw,
        active: existingTipRaw.active ?? 0
      };

      const updatedTipRaw = await prisma.tips.update({
        where: { id_tip: tipId },
        data: {
          tip: tip.trim(),
        },
      });

      const updatedTip: Tip = {
        ...updatedTipRaw,
        active: updatedTipRaw.active ?? 0
      };

      return ResponseHelper.success(res, updatedTip, "Tip updated successfully");
    } catch (error) {
      console.error("Error updating tip:", error);
      return ResponseHelper.serverError(res, "Failed to update tip");
    }
  }

  // Update tip state (activate/deactivate)
  async updateTipState(req: Request<{ id: string }, {}, UpdateTipStateRequest>, res: Response): Promise<Response> {
    try {
      const tipId: number = parseInt(req.params.id);
      const { active }: UpdateTipStateRequest = req.body;

      if (isNaN(tipId) || tipId <= 0) {
        return ResponseHelper.badRequest(res, "Invalid tip ID format");
      }

      if (typeof active !== "number" || (active !== 0 && active !== 1)) {
        return ResponseHelper.badRequest(res, "Active field must be 0 (inactive) or 1 (active)");
      }

      // Verificar se a tip existe
      const existingTipRaw = await prisma.tips.findUnique({
        where: { id_tip: tipId },
      });

      if (!existingTipRaw) {
        return ResponseHelper.notFound(res, `Tip with ID ${tipId} not found`);
      }

      const existingTip: Tip = {
        ...existingTipRaw,
        active: existingTipRaw.active ?? 0
      };

      // Se já está no estado desejado, não fazer nada
      if (existingTip.active === active) {
        const status = active === 1 ? "already active" : "already inactive";
        return ResponseHelper.success(res, existingTip, `Tip is ${status}`);
      }

      // Se estiver ativando um tip, desativar todos os outros primeiro
      if (active === 1) {
        await prisma.tips.updateMany({
          where: { 
            active: 1,
            id_tip: { not: tipId } // Excluir o tip atual
          },
          data: { active: 0 },
        });
      }

      const updatedTipStateRaw = await prisma.tips.update({
        where: { id_tip: tipId },
        data: { active },
      });

      const updatedTipState: Tip = {
        ...updatedTipStateRaw,
        active: updatedTipStateRaw.active ?? 0
      };

      const message = active === 1 
        ? "Tip activated successfully (other tips were deactivated)" 
        : "Tip deactivated successfully";
      
      return ResponseHelper.success(res, updatedTipState, message);
    } catch (error) {
      console.error("Error updating tip state:", error);
      return ResponseHelper.serverError(res, "Failed to update tip state");
    }
  }

  // Delete tip
  async deleteTip(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const tipId: number = parseInt(req.params.id);

      if (isNaN(tipId) || tipId <= 0) {
        return ResponseHelper.badRequest(res, "Invalid tip ID format");
      }

      const existingTipRaw = await prisma.tips.findUnique({
        where: { id_tip: tipId },
      });

      if (!existingTipRaw) {
        return ResponseHelper.notFound(res, `Tip with ID ${tipId} not found`);
      }

      const existingTip: Tip = {
        ...existingTipRaw,
        active: existingTipRaw.active ?? 0
      };

      await prisma.tips.delete({
        where: { id_tip: tipId },
      });

      return ResponseHelper.success(res, null, "Tip deleted successfully");
    } catch (error) {
      console.error("Error deleting tip:", error);
      return ResponseHelper.serverError(res, "Failed to delete tip");
    }
  }
}