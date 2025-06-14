import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import axios from "axios";
import {
  ResponseHelper,
  Challenge,
  ChallengeWithSteps,
  UserHasChallenge,
  UserHasChallengeStep,
  CreateChallengeRequest,
  UpdateChallengeRequest,
  CreateUserHasChallengeRequest,
  UpdateUserHasChallengeDetailSeenRequest,
  UpdateUserHasChallengeProgressRequest,
  UpdateUserHasStepStateRequest,
  CreateFullChallengeRequest,
  ChallengeListResponse,
  ChallengeCountResponse,
  MostCompletedChallengeResponse,
  ChallengeInProgressResponse,
  StepUpdateResponse
} from "../utils/challengesResponseHelper";

const prisma = new PrismaClient();

export class ChallengesController {
  // Get all challenges
  async getAllChallenges(req: Request, res: Response): Promise<void> {
    try {
      const minNumber =
        typeof req.query.minNumber === "string"
          ? parseInt(req.query.minNumber)
          : undefined;
      const limit =
        typeof req.query.limit === "string"
          ? parseInt(req.query.limit)
          : undefined;
      const offset =
        typeof req.query.offset === "string" ? parseInt(req.query.offset) : 0;

      // Get challenges with filters, optional limit, and optional offset
      const challenges = await prisma.challenges.findMany({
        where: minNumber
          ? {
              number: {
                gte: minNumber,
              },
            }
          : {},
        orderBy: {
          number: "asc",
        },
        ...(limit ? { take: limit } : {}),
        ...(offset ? { skip: offset } : {}),
      });

      // Get total count for pagination metadata
      const totalChallenges = await prisma.challenges.count({
        where: minNumber
          ? {
              number: {
                gte: minNumber,
              },
            }
          : {},
      });

      // Determine if there are more challenges for the next page
      const hasNextPage = limit
        ? offset + challenges.length < totalChallenges
        : false;

      const response: ChallengeListResponse = {
        challenges,
        pagination: {
          total: totalChallenges,
          limit: limit,
          offset: offset || 0,
          hasNextPage,
        },
      };

      ResponseHelper.success(res, response, "Desafios obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching challenges:", error);
      ResponseHelper.serverError(res, "Falha ao obter desafios");
    }
  }

  // Get challenge by ID
  async getChallengeById(req: Request, res: Response): Promise<void> {
    try {
      const challengeId = parseInt(req.params.id);
      
      if (isNaN(challengeId) || challengeId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID do desafio inválido");
        return;
      }

      const challenge = await prisma.challenges.findUnique({
        where: { id_challenge: challengeId },
        include: {
          Steps: {
            include: {
              Step_Video: true,
              Step_Bet: true,
              Step_View: true,
              Step_Questionnaire: true,
            },
          },
        },
      });

      if (!challenge) {
        ResponseHelper.notFound(res, `Desafio com ID ${challengeId} não encontrado`);
        return;
      }

      ResponseHelper.success(res, challenge, "Desafio obtido com sucesso");
    } catch (error) {
      console.error("Error fetching challenge:", error);
      ResponseHelper.serverError(res, "Falha ao obter desafio");
    }
  }

  // Get count of challenges
  async countChallenges(req: Request, res: Response): Promise<void> {
    try {
      const count = await prisma.challenges.count();
      const response: ChallengeCountResponse = { count };
      
      ResponseHelper.success(res, response, "Contagem de desafios obtida com sucesso");
    } catch (error) {
      console.error("Error counting challenges:", error);
      ResponseHelper.serverError(res, "Falha ao contar desafios");
    }
  }

  // Create challenge
  async createChallenge(req: Request<{}, {}, CreateChallengeRequest>, res: Response): Promise<void> {
    try {
      const { number, name, short_description, long_description, image }: CreateChallengeRequest = req.body;

      // Validation
      if (!number || !name || !short_description || !long_description || !image) {
        ResponseHelper.badRequest(res, "Todos os campos são obrigatórios: number, name, short_description, long_description, image");
        return;
      }

      if (typeof number !== 'number' || number <= 0) {
        ResponseHelper.badRequest(res, "O número deve ser um número inteiro positivo");
        return;
      }

      // Check if challenge number already exists
      const existingChallenge = await prisma.challenges.findFirst({
        where: { number }
      });

      if (existingChallenge) {
        ResponseHelper.conflict(res, `Desafio com número ${number} já existe`);
        return;
      }

      console.log("Creating challenge:")

      const newChallenge = await prisma.challenges.create({
        data: {
          number,
          name,
          short_description,
          long_description,
          image,
        },
      });

      ResponseHelper.created(res, newChallenge, "Desafio criado com sucesso");
    } catch (error) {
      console.error("Error creating challenge:", error);
      ResponseHelper.serverError(res, "Falha ao criar desafio");
    }
  }

  // Search steps by challenge id
  async getStepsByChallengeId(req: Request, res: Response): Promise<void> {
    try {
      const challengeId = parseInt(req.params.id);
      
      if (isNaN(challengeId) || challengeId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID do desafio inválido");
        return;
      }

      const steps = await prisma.steps.findMany({
        where: { ref_id_challenges: challengeId },
        include: {
          Step_Video: true,
          Step_Bet: true,
          Step_View: true,
          Step_Questionnaire: true,
        },
      });

      ResponseHelper.success(res, steps, "Passos do desafio obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching steps:", error);
      ResponseHelper.serverError(res, "Falha ao obter passos");
    }
  }

  async getCountChallengesByDate(req: Request, res: Response): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const count = await prisma.user_has_Challenges.count({
        where: {
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      const response: ChallengeCountResponse = { count };
      ResponseHelper.success(res, response, "Contagem de desafios de hoje obtida com sucesso");
    } catch (error) {
      console.error("Error fetching today's challenges:", error);
      ResponseHelper.serverError(res, "Falha ao obter desafios de hoje");
    }
  }

  async getMostCompletedChallengeToday(req: Request, res: Response): Promise<void> {
    try {
      // Set date range for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get all challenges completed today and group by challenge ID
      const completedChallenges = await prisma.user_has_Challenges.groupBy({
        by: ["ref_id_challenge"],
        where: {
          date: {
            gte: today,
            lt: tomorrow,
          },
          completed: true,
        },
        _count: {
          ref_id_user: true,
        },
        orderBy: {
          _count: {
            ref_id_user: "desc",
          },
        },
        take: 1,
      });

      if (completedChallenges.length === 0) {
        const response: MostCompletedChallengeResponse = {
          message: "Nenhum desafio foi completado hoje",
          mostCompleted: null,
        };
        ResponseHelper.success(res, response, "Nenhum desafio completado encontrado para hoje");
        return;
      }

      // Get the most completed challenge ID
      const mostCompletedChallengeId = completedChallenges[0].ref_id_challenge;
      const completionCount = completedChallenges[0]._count.ref_id_user;

      // Get full details of the most completed challenge
      const challengeDetails = await prisma.challenges.findUnique({
        where: { id_challenge: mostCompletedChallengeId },
      });

      const response: MostCompletedChallengeResponse = {
        mostCompleted: challengeDetails,
        completionCount: completionCount,
        date: today.toISOString().split("T")[0],
      };

      ResponseHelper.success(res, response, "Desafio mais completado obtido com sucesso");
    } catch (error) {
      console.error("Error fetching most completed challenge:", error);
      ResponseHelper.serverError(res, "Falha ao obter o desafio mais completado hoje");
    }
  }

  // Get challenge by user id
  async getChallengeByUserId(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.id_user);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID do utilizador inválido");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso negado");
        return;
      }

      const challenges = await prisma.user_has_Challenges.findMany({
        where: { ref_id_user: requestedId },
        include: { challenge: true },
        orderBy: {
          challenge: {
            number: "asc",
          },
        },
      });

      ResponseHelper.success(res, challenges, "Desafios do utilizador obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      ResponseHelper.serverError(res, "Falha ao obter desafios");
    }
  }

  // Get challenges completed by user
  async getAllChallengesCompletedByUserId(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.id_user);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID do utilizador inválido");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso negado");
        return;
      }

      const challenges = await prisma.user_has_Challenges.findMany({
        where: { ref_id_user: requestedId, completed: true },
        include: { challenge: true },
        orderBy: {
          challenge: {
            number: "asc",
          },
        },
      });

      ResponseHelper.success(res, challenges, "Desafios completados obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching completed challenges:", error);
      ResponseHelper.serverError(res, "Falha ao obter desafios");
    }
  }

  // Update challenge
  async updateChallengeById(req: Request<{ id: string }, {}, UpdateChallengeRequest>, res: Response): Promise<void> {
    try {
      const challengeId = parseInt(req.params.id);
      const { name, short_description, long_description, image }: UpdateChallengeRequest = req.body;

      if (isNaN(challengeId) || challengeId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID do desafio inválido");
        return;
      }

      // Check if challenge exists
      const existingChallenge = await prisma.challenges.findUnique({
        where: { id_challenge: challengeId },
      });

      if (!existingChallenge) {
        ResponseHelper.notFound(res, `Desafio com ID ${challengeId} não encontrado`);
        return;
      }

      const updatedChallenge = await prisma.challenges.update({
        where: { id_challenge: challengeId },
        data: {
          ...(name && { name }),
          ...(short_description && { short_description }),
          ...(long_description && { long_description }),
          ...(image && { image }),
        },
      });

      ResponseHelper.success(res, updatedChallenge, "Desafio atualizado com sucesso");
    } catch (error) {
      console.error("Error updating challenge:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar desafio");
    }
  }

  // Delete challenge
  async deleteChallengeById(req: Request, res: Response): Promise<void> {
    try {
      const challengeId = parseInt(req.params.id);

      if (isNaN(challengeId) || challengeId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID do desafio inválido");
        return;
      }

      // Check if challenge exists
      const existingChallenge = await prisma.challenges.findUnique({
        where: { id_challenge: challengeId },
      });

      if (!existingChallenge) {
        ResponseHelper.notFound(res, `Desafio com ID ${challengeId} não encontrado`);
        return;
      }

      await prisma.challenges.delete({
        where: { id_challenge: challengeId },
      });

      ResponseHelper.noContent(res, "Desafio eliminado com sucesso");
    } catch (error) {
      console.error("Error deleting challenge:", error);
      ResponseHelper.serverError(res, "Falha ao eliminar desafio");
    }
  }

  // Create user has challenges
  async createUserHasChallenges(req: Request<{ id_user: string, id_challenge: string }, {}, CreateUserHasChallengeRequest>, res: Response): Promise<void> {
    try {
      const { completed, blocked, detail_seen }: CreateUserHasChallengeRequest = req.body;

      // Ensure all required fields are provided
      if (completed === undefined || blocked === undefined || detail_seen === undefined) {
        ResponseHelper.badRequest(res, "Campos obrigatórios em falta: completed, blocked, e detail_seen são obrigatórios");
        return;
      }

      // Validate IDs
      const userId = parseInt(req.params.id_user);
      const challengeId = parseInt(req.params.id_challenge);

      if (isNaN(userId) || isNaN(challengeId)) {
        ResponseHelper.badRequest(res, "ID do utilizador ou ID do desafio inválido");
        return;
      }

      // Check if user and challenge exist
      const userExists = await prisma.users.findUnique({
        where: { id_user: userId },
      });

      const challengeExists = await prisma.challenges.findUnique({
        where: { id_challenge: challengeId },
      });

      if (!userExists) {
        ResponseHelper.notFound(res, "Utilizador não encontrado");
        return;
      }

      if (!challengeExists) {
        ResponseHelper.notFound(res, "Desafio não encontrado");
        return;
      }

      // Try to create the record
      const newUserHasChallenge = await prisma.user_has_Challenges.create({
        data: {
          ref_id_user: userId,
          ref_id_challenge: challengeId,
          completed,
          blocked,
          detail_seen,
        },
      });

      // Get steps for the challenge
      const steps = await prisma.steps.findMany({
        where: { ref_id_challenges: challengeId },
      });

      // Create relation between user/challenge and steps
      const stepsToCreate = steps.map((step) =>
        prisma.user_has_Challenges_has_Steps.create({
          data: {
            ref_user_has_Challenges_id_user: userId,
            ref_user_has_Challenges_id_challenge: challengeId,
            ref_id_steps: step.id_step,
            state: 0,
          },
        })
      );

      await Promise.all(stepsToCreate);

      ResponseHelper.created(res, newUserHasChallenge, "Relação utilizador-desafio criada com sucesso");
    } catch (error) {
      console.error("Error details:", error);

      // Check for specific error types
      if ((error as any).code === "P2002") {
        ResponseHelper.conflict(res, "Este utilizador já tem este desafio atribuído");
        return;
      }

      ResponseHelper.serverError(res, "Falha ao criar relação utilizador-desafio");
    }
  }

  // Update user has challenges blocked
  async unblockNextChallenge(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.id_user);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID do utilizador inválido");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso negado");
        return;
      }

      const currentChallengeId = parseInt(req.params.id_challenge);

      if (isNaN(currentChallengeId) || currentChallengeId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID do desafio inválido");
        return;
      }

      const currentChallenge = await prisma.challenges.findUnique({
        where: { id_challenge: currentChallengeId },
      });

      if (!currentChallenge) {
        ResponseHelper.notFound(res, "Desafio atual não encontrado");
        return;
      }

      const nextChallenge = await prisma.challenges.findFirst({
        where: {
          number: {
            gt: currentChallenge.number,
          },
        },
        orderBy: {
          number: "asc",
        },
      });

      if (!nextChallenge) {
        ResponseHelper.notFound(res, "Próximo desafio não encontrado");
        return;
      }

      const existingRelationship = await prisma.user_has_Challenges.findUnique({
        where: {
          ref_id_user_ref_id_challenge: {
            ref_id_user: requestedId,
            ref_id_challenge: nextChallenge.id_challenge,
          },
        },
      });

      if (existingRelationship) {
        // Unblock challenge if it already exists
        const updatedUserHasChallenge = await prisma.user_has_Challenges.update({
          where: {
            ref_id_user_ref_id_challenge: {
              ref_id_user: requestedId,
              ref_id_challenge: nextChallenge.id_challenge,
            },
          },
          data: {
            blocked: false,
          },
        });

        ResponseHelper.success(res, updatedUserHasChallenge, "Próximo desafio desbloqueado com sucesso");
        return;
      } else {
        // Create new relation
        const newUserHasChallenge = await prisma.user_has_Challenges.create({
          data: {
            ref_id_user: requestedId,
            ref_id_challenge: nextChallenge.id_challenge,
            completed: false,
            blocked: false,
            detail_seen: false,
          },
        });

        // Get steps for that challenge
        const steps = await prisma.steps.findMany({
          where: { ref_id_challenges: nextChallenge.id_challenge },
        });

        // Create relation between user/challenge and steps
        await prisma.user_has_Challenges_has_Steps.createMany({
          data: steps.map((step) => ({
            ref_user_has_Challenges_id_user: requestedId,
            ref_user_has_Challenges_id_challenge: nextChallenge.id_challenge,
            ref_id_steps: step.id_step,
            state: 0,
          })),
          skipDuplicates: true,
        });

        ResponseHelper.created(res, newUserHasChallenge, "Próximo desafio criado e desbloqueado com sucesso");
        return;
      }
    } catch (error) {
      console.error("Error details:", error);
      ResponseHelper.serverError(res, "Falha ao desbloquear próximo desafio");
    }
  }

  //update user has challenges detail_seen
  async updateUserHasChallengesDetailSeen(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.id_user);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID do utilizador inválido");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso negado");
        return;
      }
      
      const challengeId = parseInt(req.params.id_challenge);
      const { detail_seen } = req.body;

      if (isNaN(challengeId) || challengeId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID do desafio inválido");
        return;
      }

      if (typeof detail_seen !== 'boolean') {
        ResponseHelper.badRequest(res, "detail_seen deve ser um valor booleano");
        return;
      }

      const updatedUserHasChallenge = await prisma.user_has_Challenges.update({
        where: {
          ref_id_user_ref_id_challenge: {
            ref_id_user: requestedId,
            ref_id_challenge: challengeId,
          },
        },
        data: {
          detail_seen,
        },
      });

      ResponseHelper.success(res, updatedUserHasChallenge, "Estado de visualização de detalhes do desafio atualizado com sucesso");
    } catch (error) {
      console.error("Error updating challenge detail seen:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar relação utilizador-desafio");
    }
  }

  //update user has challenges progress_percentage
  async updateUserHasChallengesProgressPercentage(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.id_user);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID do utilizador inválido");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso negado");
        return;
      }
      
      const challengeId = parseInt(req.params.id_challenge);
      const { progress_percentage } = req.body;

      // Verificação básica de IDs
      if (isNaN(requestedId) || isNaN(challengeId)) {
        ResponseHelper.badRequest(res, "ID do utilizador ou ID do desafio inválido");
        return;
      }

      // Verificação do progresso
      if (
        typeof progress_percentage !== "number" ||
        progress_percentage < 0 ||
        progress_percentage > 100
      ) {
        ResponseHelper.badRequest(res, "Percentagem de progresso inválida - deve ser um número entre 0 e 100");
        return;
      }

      // Atualizar o progresso
      const updatedUserHasChallenge = await prisma.user_has_Challenges.update({
        where: {
          ref_id_user_ref_id_challenge: {
            ref_id_user: requestedId,
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
              ref_id_user: requestedId,
              ref_id_challenge: challengeId,
            },
          },
          data: {
            completed: true,
          },
        });

        try {
          await axios.post(
            `https://api-betlearn-wine.vercel.app/api/challenges/${requestedId}/${challengeId}/unblock-next`
          );
        } catch (axiosError) {
          console.error("Failed to unblock next challenge:", axiosError);
        }
      }

      ResponseHelper.success(res, updatedUserHasChallenge, "Progresso do desafio atualizado com sucesso");
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar progresso do desafio do utilizador");
    }
  }

  async updateUserHasStepState(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const { id_user, id_challenge, id_step } = req.params;
      const tokenUserId = parseInt(req.userId!);
      const userId = parseInt(id_user);

      if (isNaN(userId) || userId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (role !== 'admin' && userId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso negado");
        return;
      }
      
      const { state } = req.body;
      const challengeId = parseInt(id_challenge);
      const stepId = parseInt(id_step);

      if (isNaN(challengeId) || isNaN(stepId)) {
        ResponseHelper.badRequest(res, "ID de desafio ou ID de passo inválido");
        return;
      }

      if (typeof state !== 'number' || (state !== 0 && state !== 1)) {
        ResponseHelper.badRequest(res, "O estado deve ser 0 ou 1");
        return;
      }

      const debugLogs: string[] = [];

      debugLogs.push(
        `Starting update for user: ${userId}, challenge: ${challengeId}, step: ${stepId}, state: ${state}`
      );

      const existingRecord =
        await prisma.user_has_Challenges_has_Steps.findFirst({
          where: {
            ref_user_has_Challenges_id_user: userId,
            ref_user_has_Challenges_id_challenge: challengeId,
            ref_id_steps: stepId,
          },
        });

      if (!existingRecord) {
        debugLogs.push("Step record not found");
        ResponseHelper.notFound(res, "Passo não encontrado");
        return;
      }

      debugLogs.push(
        `Existing state: ${existingRecord.state}, New state: ${state}`
      );

      if (existingRecord.state === state) {
        debugLogs.push("State is already up to date");
        const response: StepUpdateResponse = {
          message: "Passo já atualizado",
          progress_percentage: 0,
          updatedStep: existingRecord,
          total_steps: 0,
          debug_logs: debugLogs,
        };
        ResponseHelper.success(res, response, "Passo já atualizado");
        return;
      }

      // Atualizar o estado do step
      const updatedStep = await prisma.user_has_Challenges_has_Steps.updateMany(
        {
          where: {
            ref_user_has_Challenges_id_user: userId,
            ref_user_has_Challenges_id_challenge: challengeId,
            ref_id_steps: stepId,
          },
          data: {
            state: state,
          },
        }
      );

      // Recalcular percentagem
      const totalSteps = await prisma.user_has_Challenges_has_Steps.count({
        where: {
          ref_user_has_Challenges_id_user: userId,
          ref_user_has_Challenges_id_challenge: challengeId,
        },
      });

      const completedSteps = await prisma.user_has_Challenges_has_Steps.count({
        where: {
          ref_user_has_Challenges_id_user: userId,
          ref_user_has_Challenges_id_challenge: challengeId,
          state: 1,
        },
      });

      const stepPercentage =
        totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

      // Atualizar a tabela user_has_Challenges com a percentagem
      const progressUpdate = await prisma.user_has_Challenges.updateMany({
        where: {
          ref_id_user: userId,
          ref_id_challenge: challengeId,
        },
        data: {
          progress_percentage: stepPercentage,
        },
      });

      // Se completou o desafio (progress_percentage == 100)
      if (stepPercentage === 100) {
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
            `https://api-betlearn-wine.vercel.app/api/challenges/${userId}/${challengeId}/unblock-next`
          );
        } catch (axiosError) {
          console.error("Failed to unblock next challenge:", axiosError);
        }
      }

      debugLogs.push(
        `Updated user_has_Challenges: ${progressUpdate.count} record(s)`
      );

      const response: StepUpdateResponse = {
        message: "Passo atualizado e progresso recalculado",
        progress_percentage: stepPercentage,
        updatedStep,
        total_steps: totalSteps,
        debug_logs: debugLogs,
      };

      ResponseHelper.success(res, response, "Passo atualizado e progresso recalculado com sucesso");
    } catch (error) {
      console.error("Error:", error);
      ResponseHelper.serverError(res, `Erro interno do servidor: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  }

  //Função para ir buscar o desafio em progresso
  //Função para ir buscar o desafio em progresso
  async getChallengeInProgress(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.id);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso negado");
        return;
      }

      // Vai buscar um desafio que tenha progress_percentage >= 0 e < 100 (em progresso)
      // e que não esteja completo (completed = false)
      const challengeInProgress = await prisma.user_has_Challenges.findFirst({
        where: {
          ref_id_user: requestedId,
          completed: false,
          blocked: false,
          progress_percentage: {
            gte: 0,
            lt: 100,
          },
        },
        include: {
          challenge: true,
        },
      });

      if (!challengeInProgress) {
        ResponseHelper.notFound(res, "Nenhum desafio em progresso encontrado para este utilizador");
        return;
      }

      // Vai buscar os steps do desafio em progresso
      const steps = await prisma.user_has_Challenges_has_Steps.findMany({
        where: {
          ref_user_has_Challenges_id_user: requestedId,
          ref_user_has_Challenges_id_challenge:
            challengeInProgress.ref_id_challenge,
        },
        include: {
          step: {
            include: {
              Step_Video: true,
              Step_Bet: true,
              Step_View: true,
              Step_Questionnaire: true,
            },
          },
        },
        orderBy: {
          ref_id_steps: "asc",
        },
      });

      const response: ChallengeInProgressResponse = {
        challenge: challengeInProgress.challenge!,
        progress: {
          progress_percentage: challengeInProgress.progress_percentage,
          detail_seen: challengeInProgress.detail_seen,
        },
        steps: steps,
      };

      ResponseHelper.success(res, response, "Desafio em progresso obtido com sucesso");
    } catch (error) {
      console.error("Error fetching challenge in progress:", error);
      ResponseHelper.serverError(res, "Falha ao obter desafio em progresso");
    }
  }

   async createFullChallenge(req: Request<{}, {}, CreateFullChallengeRequest>, res: Response): Promise<void> {
    try {


      const { challenge, steps }: CreateFullChallengeRequest = req.body;

      // Validation
      if (!challenge || !steps || !Array.isArray(steps)) {
        ResponseHelper.badRequest(res, "Pedido inválido: desafio e passos são obrigatórios");
        return;
      }

      if( !challenge.image){
        challenge.image = 'https://cdn-icons-png.flaticon.com/512/2583/2583319.png';
      }

      if (!challenge.number || !challenge.name || !challenge.short_description || !challenge.long_description || !challenge.image) {
        ResponseHelper.badRequest(res, "Todos os campos do desafio são obrigatórios: número, nome, descrição curta, descrição longa, imagem");
        return;
      }

      if (typeof challenge.number !== 'number' || challenge.number <= 0) {
        ResponseHelper.badRequest(res, "O número do desafio deve ser um número inteiro positivo");
        return;
      }

      if (steps.length === 0) {
        ResponseHelper.badRequest(res, "Pelo menos um passo é obrigatório");
        return;
      }

      // Check if challenge number already exists
      const existingChallenge = await prisma.challenges.findFirst({
        where: { number: challenge.number }
      });

      if (existingChallenge) {
        ResponseHelper.conflict(res, `Desafio com número ${challenge.number} já existe`);
        return;
      }

      console.log("Creating challenge with steps:", challenge, steps);

      // Usar transação para garantir que todas as operações sejam bem-sucedidas
      const result = await prisma.$transaction(async (tx) => {
        // 1. Criar o challenge
        const createdChallenge = await tx.challenges.create({
          data: {
            number: challenge.number,
            name: challenge.name,
            short_description: challenge.short_description,
            long_description: challenge.long_description,
            image: challenge.image,
          },
        });

        // 2. Criar cada step do challenge
        const createdSteps = [];

        for (const stepData of steps) {
          let stepVideoId = null;
          let stepBetId = null;
          let stepViewId = null;
          let stepQuestionnaireId = null;

          // Validar tipo de step
          if (!['video', 'bet', 'view', 'questionnaire'].includes(stepData.type)) {
            throw new Error(`Tipo de passo inválido: ${stepData.type}`);
          }

          // Criar o tipo específico de step
          if (
            stepData.type === "video" &&
            stepData.data.video_url &&
            stepData.data.video_description
          ) {
            const video = await tx.step_Video.create({
              data: {
                video_url: stepData.data.video_url,
                video_description: stepData.data.video_description,
              },
            });
            stepVideoId = video.id_step_video;
          } else if (
            stepData.type === "bet" &&
            stepData.data.bet_description
          ) {
            const bet = await tx.step_Bet.create({
              data: {
                bet_description: stepData.data.bet_description,
              },
            });
            stepBetId = bet.id_step_bet;
          } else if (
            stepData.type === "view" &&
            stepData.data.view_description &&
            stepData.data.view_page
          ) {
            const view = await tx.step_View.create({
              data: {
                view_description: stepData.data.view_description,
                view_page: stepData.data.view_page,
              },
            });
            stepViewId = view.id_step_view;
          } else if (
            stepData.type === "questionnaire" &&
            stepData.data.questionnaire_description &&
            stepData.data.questionnaire_json
          ) {
            const questionnaire = await tx.step_Questionnaire.create({
              data: {
                questionnaire_description: stepData.data.questionnaire_description,
                questionnaire_json: stepData.data.questionnaire_json,
              },
            });
            stepQuestionnaireId = questionnaire.id_step_questionnaire;
          } else {
            throw new Error(`Dados obrigatórios em falta para o tipo de passo: ${stepData.type}`);
          }

          // Criar o registro na tabela Steps
          const step = await tx.steps.create({
            data: {
              ref_id_step_video: stepVideoId,
              ref_id_step_bet: stepBetId,
              ref_id_step_view: stepViewId,
              ref_id_step_questionnaire: stepQuestionnaireId,
              ref_id_challenges: createdChallenge.id_challenge,
            },
          });

          createdSteps.push(step);
        }

        // Retornar todos os dados criados
        return {
          challenge: createdChallenge,
          steps: createdSteps,
        };
      });

      ResponseHelper.created(res, result, "Desafio criado com sucesso com todos os passos");
    } catch (error) {
      console.error("Error creating challenge:", error);
      ResponseHelper.serverError(res, "Falha ao criar desafio com passos");
    }
  }
}