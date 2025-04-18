import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class TipsController {
  // Get tips
  async getTips(req: Request, res: Response) {
    try {
      const tips = await prisma.tips.findMany();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tips" });
    }
  }

  // Get tips by ID
  async getTipById(req: Request, res: Response) {
    try {
      const tipId = parseInt(req.params.id);
      const tip = await prisma.tips.findUnique({
        where: { id_tip: tipId },
      });
      res.json(tip);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tip vai poh caralho" });
    }
  }

  // Get currently active tip
  async getActiveTip(req: Request, res: Response) {
    try {
      //COM FIND MANY MAS SÓ VAI ENCONTRAR 1 PORQUE SÓ VAI HAVER 1
      const tip = await prisma.tips.findFirst({
        where: { active: 1 },
      });

      res.json(tip);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tip" });
    }
  }

  // Create tip
  async createTip(req: Request, res: Response) {
    try {
      const { tip } = req.body;
      const newTip = await prisma.tips.create({
        data: {
          tip,
        },
      });
      res.json(newTip);
    } catch (error) {
      res.status(500).json({ error: "Failed to create tip" });
    }
  }

  // Update tip
  async updateTip(req: Request, res: Response) {
    try {
      const tipId = parseInt(req.params.id);
      const { tip } = req.body;
      const updatedTip = await prisma.tips.update({
        where: { id_tip: tipId },
        data: {
          tip,
        },
      });
      res.json(updatedTip);
    } catch (error) {
      res.status(500).json({ error: "Failed to update tip" });
    }
  }

  //UPDATE TIP STATE
  async updateTipState(req: Request, res: Response) {
    try {
      const tipId = parseInt(req.params.id);
      const { active } = req.body;
      const updatedTipState = await prisma.tips.update({
        where: { id_tip: tipId },
        data: {
          active,
        },
      });
      res.json(updatedTipState);
    } catch (error) {
      res.status(500).json({ error: "Failed to update tip state" });
    }
  }

  // Delete tip
  async deleteTip(req: Request, res: Response) {
    try {
      const tipId = parseInt(req.params.id);
      await prisma.tips.delete({
        where: { id_tip: tipId },
      });
      res.json({ message: "Tip deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete tip" });
    }
  }
}
