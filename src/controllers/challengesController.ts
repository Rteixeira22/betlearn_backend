import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import axios from "axios";

const prisma = new PrismaClient();

export class ChallengesController {
  // Get all challenges
  async getAllChallenges(req: Request, res: Response) {
    try {
      const challenges = await prisma.challenges.findMany();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch challenges" });
    }
  }
  // Get challenge by ID
  async getChallengeById(req: Request, res: Response) {
    try {
      const challengeId = parseInt(req.params.id);
      const challenge = await prisma.challenges.findUnique({
        where: { id_challenge: challengeId },
      });
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch challenge" });
    }
  }

  //Get count of challenges
  async countChallenges(req: Request, res: Response) {
    try {
      const count = await prisma.challenges.count();
      console.log("Count fetched successfully:", count);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to count challenges" });
    }
  }

  // create challenge
  async createChallenge(req: Request, res: Response) {
    try {
      const { number, name, short_description, long_description, image } =
        req.body;
      const newChallenge = await prisma.challenges.create({
        data: {
          number,
          name,
          short_description,
          long_description,
          image,
        },
      });
      res.status(201).json(newChallenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to create challenge" });
    }
  }

  //search steps by challenge id
  async getStepsByChallengeId(req: Request, res: Response) {
    try {
      const challengeId = parseInt(req.params.id);
      const steps = await prisma.steps.findMany({
        where: { ref_id_challenges: challengeId },
      });
      res.json(steps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch steps" });
    }
  }

  // Update challenge
  async updateChallengeById(req: Request, res: Response) {
    try {
      const challengeId = parseInt(req.params.id);
      const { name, short_description, long_description, image } = req.body;
      const updatedChallenge = await prisma.challenges.update({
        where: { id_challenge: challengeId },
        data: {
          name,
          short_description,
          long_description,
          image,
        },
      });
      res.json(updatedChallenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to update challenge" });
    }
  }
  // Delete challenge
  async deleteChallengeById(req: Request, res: Response) {
    try {
      const challengeId = parseInt(req.params.id);
      await prisma.challenges.delete({
        where: { id_challenge: challengeId },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete challenge" });
    }
  }

  //Create user has challenges
  async createUserHasChallenges(req: Request, res: Response) {
    try {
      const { completed, blocked, detail_seen } = req.body;

      // Ensure all required fields are provided
      if (
        completed === undefined ||
        blocked === undefined ||
        detail_seen === undefined
      ) {
        res.status(400).json({
          error:
            "Missing required fields: completed, blocked, and detail_seen are required",
        });
      }

      // Validate IDs
      const userId = parseInt(req.params.id_user);
      const challengeId = parseInt(req.params.id_challenge);

      if (isNaN(userId) || isNaN(challengeId)) {
        res.status(400).json({
          error: "Invalid user ID or challenge ID",
        });
      }

      // Check if user and challenge exist
      const userExists = await prisma.users.findUnique({
        where: { id_user: userId },
      });

      const challengeExists = await prisma.challenges.findUnique({
        where: { id_challenge: challengeId },
      });

      if (!userExists || !challengeExists) {
        res.status(404).json({
          error: !userExists ? "User not found" : "Challenge not found",
        });
      }

      // Try to create the record
      const newUserHasChallenge = await prisma.user_has_Challenges.create({
        data: {
          ref_id_user: userId,
          ref_id_challenge: challengeId,
          completed,
          blocked,
          detail_seen,
          // progress_percentage will use its default value
        },
      });

      res.status(201).json(newUserHasChallenge);
    } catch (error) {
      console.error("Error details:", error);

      // Check for specific error types
      if ((error as any).code === "P2002") {
        res.status(409).json({
          error: "This user already has this challenge assigned",
        });
      }

      res.status(500).json({
        error: "Failed to create user has challenge",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  //update user has challenges blocked
  async unblockNextChallenge(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id_user);
      const currentChallengeId = parseInt(req.params.id_challenge);

      // First, get the current challenge to find its number
      const currentChallenge = await prisma.challenges.findUnique({
        where: { id_challenge: currentChallengeId },
      });

      if (!currentChallenge) {
        res.status(404).json({ error: "Current challenge not found" });
      }

      // Find the next challenge based on the number field
      const nextChallenge = await prisma.challenges.findFirst({
        where: {
          number: {
            gt: currentChallenge?.number,
          },
        },
        orderBy: {
          number: "asc",
        },
      });

      if (!nextChallenge) {
        res.status(404).json({ error: "No next challenge found" });
      }

      // Check if a relationship already exists for the user and next challenge
      const existingRelationship = await prisma.user_has_Challenges.findUnique({
        where: {
          ref_id_user_ref_id_challenge: {
            ref_id_user: userId,
            ref_id_challenge: nextChallenge?.id_challenge ?? 0,
          },
        },
      });

      if (existingRelationship) {
        // Update the existing relationship to unblock it
        const updatedUserHasChallenge = await prisma.user_has_Challenges.update(
          {
            where: {
              ref_id_user_ref_id_challenge: {
                ref_id_user: userId,
                ref_id_challenge: nextChallenge?.id_challenge ?? 0,
              },
            },
            data: {
              blocked: false,
            },
          }
        );

        res.json(updatedUserHasChallenge);
      } else {
        // Create a new relationship with the next challenge (unblocked)
        const newUserHasChallenge = await prisma.user_has_Challenges.create({
          data: {
            ref_id_user: userId,
            ref_id_challenge: nextChallenge?.id_challenge ?? 0,
            completed: false,
            blocked: false,
            detail_seen: false,
          },
        });

        res.status(201).json(newUserHasChallenge);
      }
    } catch (error) {
      console.error("Error details:", error);
      res.status(500).json({
        error: "Failed to unblock next challenge",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  //update user has challenges detail_seen
  async updateUserHasChallengesDetailSeen(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id_user);
      const challengeId = parseInt(req.params.id_challenge);
      const { detail_seen } = req.body;
      const updatedUserHasChallenge = await prisma.user_has_Challenges.update({
        where: {
          ref_id_user_ref_id_challenge: {
            ref_id_user: userId,
            ref_id_challenge: challengeId,
          },
        },
        data: {
          detail_seen,
        },
      });
      res.json(updatedUserHasChallenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user has challenge" });
    }
  }

  //update user has challenges progress_percentage
  async updateUserHasChallengesProgressPercentage(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id_user);
      const challengeId = Number(req.params.id_challenge);
      const { progress_percentage } = req.body;

      // Verificação básica de IDs
      if (isNaN(userId) || isNaN(challengeId)) {
        res.status(400).json({ error: "Invalid user or challenge ID" });
      }

      // Verificação do progresso
      if (
        typeof progress_percentage !== "number" ||
        progress_percentage < 0 ||
        progress_percentage > 100
      ) {
        res.status(400).json({ error: "Invalid progress percentage" });
      }

      // Atualizar o progresso
      const updatedUserHasChallenge = await prisma.user_has_Challenges.update({
        where: {
          ref_id_user_ref_id_challenge: {
            ref_id_user: userId,
            ref_id_challenge: challengeId,
          },
        },
        data: {
          progress_percentage,
        },
      });

      // Se completou o desafio (progress_percentage == 100)
      if (progress_percentage === 100) {
        // Atualizar como completado
        await prisma.user_has_Challenges.update({
          where: {
            ref_id_user_ref_id_challenge: {
              ref_id_user: userId,
              ref_id_challenge: challengeId,
            },
          },
          data: {
            completed: true,
          },
        });

        // Desbloquear o próximo desafio chamando diretamente a função (se possível)
        try {
          await axios.post(
            `http://localhost:3000/api/challenges/${userId}/${challengeId}/unblock-next`
          );
        } catch (axiosError) {
          console.error("Failed to unblock next challenge:", axiosError);
        }
      }

      res.json(updatedUserHasChallenge);
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      res
        .status(500)
        .json({ error: "Failed to update user challenge progress" });
    }
  }

  async updateUserHasStepState(req: Request, res: Response) {
    const { id_user, id_challenge } = req.params;
    const { ref_id_steps, state } = req.body; // Esperamos um body com os IDs dos steps e o novo estado

    try {
      // Atualizar o estado do step na tabela `user_has_challenges_has_steps`
      const updatedStep = await prisma.user_has_Challenges_has_Steps.updateMany(
        {
          where: {
            ref_user_has_Challenges_id_user: parseInt(id_user),
            ref_user_has_Challenges_id_challenge: parseInt(id_challenge),
            ref_id_steps: { in: ref_id_steps },
          },
          data: {
            state: state, // Atualizando o estado do step
          },
        }
      );

      // Obter o número total de steps para esse desafio e o número de steps concluídos
      const totalSteps = await prisma.user_has_Challenges_has_Steps.count({
        where: {
          ref_user_has_Challenges_id_user: parseInt(id_user),
          ref_user_has_Challenges_id_challenge: parseInt(id_challenge),
        },
      });

      const completedSteps = await prisma.user_has_Challenges_has_Steps.count({
        where: {
          ref_user_has_Challenges_id_user: parseInt(id_user),
          ref_user_has_Challenges_id_challenge: parseInt(id_challenge),
          state: 1, // Considera os steps com estado "completo"
        },
      });

      // Calcular a percentagem de progresso
      const progressPercentage = (completedSteps / totalSteps) * 100;

      // Enviar o progresso para o endpoint especificado
      const response = await axios.patch(
        `http://localhost:3000/api/challenges/${id_user}/${id_challenge}/progress`,
        {
          progress_percentage: progressPercentage,
        }
      );

      res.status(200).json({
        message: "Step state updated successfully",
        progress_percentage: progressPercentage,
        progress_response: response.data,
        updatedStep,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
