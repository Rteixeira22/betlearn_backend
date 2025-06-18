import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { 
  ResponseHelper, 
  Tip, 
  CreateTipRequest, 
  UpdateTipRequest, 
  UpdateTipStateRequest 
} from "../utils/tipsResponseHelper";

const prisma = new PrismaClient();

export class TipsController {
  // Get all tips
  async getTips(req: Request, res: Response): Promise<void> {
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
      
       ResponseHelper.success(res, tips, "Dicas obtidas com sucesso");
    } catch (error) {
      console.error("Error fetching tips:", error);
       ResponseHelper.serverError(res, "Falha ao obter dicas");
    }
  }

  // Get tip by ID
  async getTipById(req: Request, res: Response): Promise<void> {
    try {
      const tipId: number = parseInt(req.params.id);
      
      if (isNaN(tipId) || tipId <= 0) {
         ResponseHelper.badRequest(res, "Formato de ID da dica inválido");
      }

      const tipRaw = await prisma.tips.findUnique({
        where: { id_tip: tipId },
      });

      if (!tipRaw) {
         ResponseHelper.notFound(res, `Dica com ID ${tipId} não encontrada`);
      } else {
        const tip: Tip = {
          id_tip: tipRaw.id_tip!,
          tip: tipRaw.tip!,
          active: tipRaw.active ?? 0
        };
        ResponseHelper.success(res, tip, "Dica obtida com sucesso");
      }

    } catch (error) {
       ResponseHelper.serverError(res, "Falha ao obter dica");
    }
  }

  // Get currently active tip
  async getActiveTip(req: Request, res: Response): Promise<void> {
    try {
      const tipRaw = await prisma.tips.findFirst({
        where: { active: 1 },
      });

      if (!tipRaw) {
         ResponseHelper.notFound(res, "Nenhuma dica ativa encontrada");
      } else {
        const tip: Tip = {
          id_tip: tipRaw.id_tip!,
          tip: tipRaw.tip!,
          active: tipRaw.active ?? 0
        };

        ResponseHelper.success(res, tip, "Dica ativa obtida com sucesso");
      }

      
    } catch (error) {
       ResponseHelper.serverError(res, "Falha ao obter dica ativa");
    }
  }

  // Create new tip
  async createTip(req: Request<{}, {}, CreateTipRequest>, res: Response): Promise<void> {
    try {
      const { tip }: CreateTipRequest = req.body;

      if (!tip) {
         ResponseHelper.badRequest(res, "Conteúdo da dica é obrigatório");
      }

      if (typeof tip !== 'string') {
         ResponseHelper.badRequest(res, "Conteúdo da dica deve ser uma string");
      }

      if (tip.trim().length === 0) {
         ResponseHelper.badRequest(res, "Conteúdo da dica não pode estar vazio");
      }

      if (tip.trim().length > 1000) {
         ResponseHelper.badRequest(res, "Conteúdo da dica é demasiado longo (máximo 1000 caracteres)");
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

       ResponseHelper.created(res, newTip, "Dica criada com sucesso");
    } catch (error) {
       ResponseHelper.serverError(res, "Falha ao criar dica");
    }
  }

  // Update tip content
  async updateTip(req: Request<{ id: string }, {}, UpdateTipRequest>, res: Response): Promise<void> {
    try {
      const tipId: number = parseInt(req.params.id);
      const { tip }: UpdateTipRequest = req.body;

      if (isNaN(tipId) || tipId <= 0) {
         ResponseHelper.badRequest(res, "Formato de ID da dica inválido");
      }

      if (!tip) {
         ResponseHelper.badRequest(res, "Conteúdo da dica é obrigatório");
      }

      if (typeof tip !== 'string') {
         ResponseHelper.badRequest(res, "Conteúdo da dica deve ser uma string");
      }

      if (tip && tip.trim().length === 0) {
         ResponseHelper.badRequest(res, "Conteúdo da dica não pode estar vazio");
      }

      if (tip && tip.trim().length > 1000) {
         ResponseHelper.badRequest(res, "Conteúdo da dica é demasiado longo (máximo 1000 caracteres)");
      }

      const existingTipRaw = await prisma.tips.findUnique({
        where: { id_tip: tipId },
      });

      if (!existingTipRaw) {
         ResponseHelper.notFound(res, `Dica com ID ${tipId} não encontrada`);
      }

      if(existingTipRaw) {
        const existingTip: Tip = {
          ...existingTipRaw,
          active: existingTipRaw.active ?? 0
        };
      }
      

      if (tip) {
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

       ResponseHelper.success(res, updatedTip, "Dica atualizada com sucesso");

      }

    } catch (error) {
       ResponseHelper.serverError(res, "Falha ao atualizar dica");
    }
  }

  // Update tip state (activate/deactivate)
  async updateTipState(req: Request<{ id: string }, {}, UpdateTipStateRequest>, res: Response): Promise<void> {
    try {
      const tipId: number = parseInt(req.params.id);
      const { active }: UpdateTipStateRequest = req.body;

      if (isNaN(tipId) || tipId <= 0) {
         ResponseHelper.badRequest(res, "Formato de ID da dica inválido");
      }

      if (typeof active !== "number" || (active !== 0 && active !== 1)) {
         ResponseHelper.badRequest(res, "Campo ativo deve ser 0 (inativo) ou 1 (ativo)");
      }

      // Verificar se a tip existe
      const existingTipRaw = await prisma.tips.findUnique({
        where: { id_tip: tipId },
      });

      if (!existingTipRaw) {
         ResponseHelper.notFound(res, `Dica com ID ${tipId} não encontrada`);
      } else {

        const existingTip: Tip = {
          ...existingTipRaw,
          active: existingTipRaw.active ?? 0
        };

        
        // Se já está no estado desejado, não fazer nada
        if (existingTip.active === active) {
          const status = active === 1 ? "já ativa" : "já inativa";
          ResponseHelper.success(res, existingTip, `Dica ${status}`);
        }
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
        ? "Dica ativada com sucesso (outras dicas foram desativadas)" 
        : "Dica desativada com sucesso";
      
       ResponseHelper.success(res, updatedTipState, message);
    } catch (error) {
       ResponseHelper.serverError(res, "Falha ao atualizar estado da dica");
    }
  }

  // Delete tip
  async deleteTip(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const tipId: number = parseInt(req.params.id);

      if (isNaN(tipId) || tipId <= 0) {
         ResponseHelper.badRequest(res, "Formato de ID da dica inválido");
      }

      const existingTipRaw = await prisma.tips.findUnique({
        where: { id_tip: tipId },
      });

      if (!existingTipRaw) {
         ResponseHelper.notFound(res, `Dica com ID ${tipId} não encontrada`);
      } else {
        const existingTip: Tip = {
          ...existingTipRaw,
          active: existingTipRaw.active ?? 0
        };

        await prisma.tips.delete({
          where: { id_tip: tipId },
        });

        ResponseHelper.success(res, null, "Dica eliminada com sucesso");
      }

      
    } catch (error) {
      console.error("Error deleting tip:", error);
       ResponseHelper.serverError(res, "Falha ao eliminar dica");
    }
  }
}