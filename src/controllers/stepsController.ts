import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { 
  ResponseHelper, 
  Step,
  StepVideo,
  StepBet,
  StepView,
  StepQuestionnaire,
  UserHasChallengesHasSteps,
  CreateStepVideoRequest,
  UpdateStepVideoRequest,
  CreateStepBetRequest,
  UpdateStepBetRequest,
  CreateStepViewRequest,
  UpdateStepViewRequest,
  CreateStepQuestionnaireRequest,
  UpdateStepQuestionnaireRequest,
  CreateStepRequest,
  UpdateStepProgressRequest
} from "../utils/stepsResponseHelper";

const prisma = new PrismaClient();

export class StepsController {
  // Get Steps
  async getSteps(req: Request, res: Response): Promise<void> {
    try {
      const stepsRaw = await prisma.steps.findMany({
        orderBy: {
          id_step: 'desc'
        }
      });

      const steps: Step[] = stepsRaw.map(step => ({
        ...step
      }));

      ResponseHelper.success(res, steps, "Passos obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching steps:", error);
      ResponseHelper.serverError(res, "Falha ao obter passos");
    }
  }

  // Get Step by ID
  async getStepById(req: Request, res: Response): Promise<void> {
    try {
      const stepId: number = parseInt(req.params.id);
      
      if (isNaN(stepId) || stepId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de passo inválido");
        return;
      }

      const stepRaw = await prisma.steps.findUnique({
        where: { id_step: stepId },
      });

      if (!stepRaw) {
        ResponseHelper.notFound(res, `Passo com ID ${stepId} não encontrado`);
        return;
      }

      const step: Step = {
        ...stepRaw
      };

      ResponseHelper.success(res, step, "Passo obtido com sucesso");
    } catch (error) {
      console.error("Error fetching step by ID:", error);
      ResponseHelper.serverError(res, "Falha ao obter passo");
    }
  }

  // Get Step by ref_id_challenges
  async getStepByRefIdChallenges(req: Request, res: Response): Promise<void> {
    try {
      const refIdChallenges: number = parseInt(req.params.ref_id_challenges);
      
      if (isNaN(refIdChallenges) || refIdChallenges <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de desafio inválido");
        return;
      }

      const stepsRaw = await prisma.steps.findMany({
        where: { ref_id_challenges: refIdChallenges },
        orderBy: { id_step: 'asc' }
      });

      const steps: Step[] = stepsRaw.map(step => ({
        ...step
      }));

      ResponseHelper.success(res, steps, "Passos do desafio obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching steps by challenge ID:", error);
      ResponseHelper.serverError(res, "Falha ao obter passos");
    }
  }

  // Get Step by video ID
  async getStepByVideoId(req: Request, res: Response): Promise<void> {
    try {
      const videoId: number = parseInt(req.params.id_video);
      
      if (isNaN(videoId) || videoId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de vídeo inválido");
        return;
      }

      const stepVideosRaw = await prisma.step_Video.findMany({
        where: { id_step_video: videoId },
      });

      const stepVideos: StepVideo[] = stepVideosRaw.map(stepVideo => ({
        ...stepVideo
      }));

      ResponseHelper.success(res, stepVideos, "Vídeos de passo obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching step by video ID:", error);
      ResponseHelper.serverError(res, "Falha ao obter vídeos de passo");
    }
  }

  // Get Step by bet ID
  async getStepByBetId(req: Request, res: Response): Promise<void> {
    try {
      const betId: number = parseInt(req.params.id_bet);
      
      if (isNaN(betId) || betId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de aposta inválido");
        return;
      }

      const stepBetsRaw = await prisma.step_Bet.findMany({
        where: { id_step_bet: betId },
      });

      const stepBets: StepBet[] = stepBetsRaw.map(stepBet => ({
        ...stepBet
      }));

      ResponseHelper.success(res, stepBets, "Apostas de passo obtidas com sucesso");
    } catch (error) {
      console.error("Error fetching step by bet ID:", error);
      ResponseHelper.serverError(res, "Falha ao obter apostas de passo");
    }
  }

  // Get Step by view ID
  async getStepByViewId(req: Request, res: Response): Promise<void> {
    try {
      const viewId: number = parseInt(req.params.id_view);
      
      if (isNaN(viewId) || viewId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de visualização inválido");
        return;
      }

      const stepViewsRaw = await prisma.step_View.findMany({
        where: { id_step_view: viewId },
      });

      const stepViews: StepView[] = stepViewsRaw.map(stepView => ({
        ...stepView
      }));

      ResponseHelper.success(res, stepViews, "Visualizações de passo obtidas com sucesso");
    } catch (error) {
      console.error("Error fetching step by view ID:", error);
      ResponseHelper.serverError(res, "Falha ao obter visualizações de passo");
    }
  }

  // Get Step by questionnaire ID
  async getStepByQuestionnaireId(req: Request, res: Response): Promise<void> {
    try {
      const questionnaireId: number = parseInt(req.params.id_questionnaire);
      
      if (isNaN(questionnaireId) || questionnaireId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de questionário inválido");
        return;
      }

      const stepQuestionnairesRaw = await prisma.step_Questionnaire.findMany({
        where: { id_step_questionnaire: questionnaireId },
      });

      const stepQuestionnaires: StepQuestionnaire[] = stepQuestionnairesRaw.map(stepQuestionnaire => ({
        ...stepQuestionnaire
      }));

      ResponseHelper.success(res, stepQuestionnaires, "Questionários de passo obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching step by questionnaire ID:", error);
      ResponseHelper.serverError(res, "Falha ao obter questionários de passo");
    }
  }

  // Get User_has_Challenges_has_Steps by User ID and Challenge ID
  async getUserHasChallengesByUserAndChallengeId(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedUserId = parseInt(req.params.id_user);
      const challengeId = parseInt(req.params.id_challenge);
      const stepId = parseInt(req.params.id_step);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedUserId) || requestedUserId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (isNaN(challengeId) || challengeId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de desafio inválido");
        return;
      }

      if (isNaN(stepId) || stepId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de passo inválido");
        return;
      }

      if (role !== 'admin' && requestedUserId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso negado");
        return;
      }

      const userHasChallengesHasStepsRaw = await prisma.user_has_Challenges_has_Steps.findMany({
        where: {
          ref_user_has_Challenges_id_user: requestedUserId,
          ref_user_has_Challenges_id_challenge: challengeId,
          ref_id_steps: stepId,
        },
      });

      const userHasChallengesHasSteps: UserHasChallengesHasSteps[] = userHasChallengesHasStepsRaw.map(item => ({
        ...item
      }));

      ResponseHelper.success(res, userHasChallengesHasSteps, "Passos de desafio do utilizador obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching user challenge steps:", error);
      ResponseHelper.serverError(res, "Falha ao obter passos de desafio do utilizador");
    }
  }

  // Create New Video
  async createNewVideo(req: Request<{}, {}, CreateStepVideoRequest>, res: Response): Promise<void> {
    try {
      const { video_url, video_description }: CreateStepVideoRequest = req.body;

      if (!video_url || typeof video_url !== 'string') {
        ResponseHelper.badRequest(res, "URL do vídeo é obrigatória e deve ser uma string válida");
        return;
      }

      if (video_url.trim().length === 0) {
        ResponseHelper.badRequest(res, "URL do vídeo não pode estar vazia");
        return;
      }

      if (video_description !== undefined && typeof video_description !== 'string') {
        ResponseHelper.badRequest(res, "Descrição do vídeo deve ser uma string");
        return;
      }

      const newVideoRaw = await prisma.step_Video.create({
        data: {
          video_url: video_url.trim(),
          video_description: video_description?.trim() || "",
        },
      });

      const newVideo: StepVideo = {
        ...newVideoRaw
      };

      ResponseHelper.created(res, newVideo, "Vídeo de passo criado com sucesso");
    } catch (error) {
      console.error("Error creating step video:", error);
      ResponseHelper.serverError(res, "Falha ao criar vídeo de passo");
    }
  }

  // Create New Step Bet
  async createNewStepBet(req: Request<{}, {}, CreateStepBetRequest>, res: Response): Promise<void> {
    try {
      const { bet_description }: CreateStepBetRequest = req.body;

      if (bet_description !== undefined && typeof bet_description !== 'string') {
        ResponseHelper.badRequest(res, "Descrição da aposta deve ser uma string");
        return;
      }

      const newStepBetRaw = await prisma.step_Bet.create({
        data: {
          bet_description: bet_description?.trim() || "",
        },
      });

      const newStepBet: StepBet = {
        ...newStepBetRaw
      };

      ResponseHelper.created(res, newStepBet, "Aposta de passo criada com sucesso");
    } catch (error) {
      console.error("Error creating step bet:", error);
      ResponseHelper.serverError(res, "Falha ao criar aposta de passo");
    }
  }

  // Create New Step View
  async createNewStepView(req: Request<{}, {}, CreateStepViewRequest>, res: Response): Promise<void> {
    try {
      const { view_description, view_page }: CreateStepViewRequest = req.body;

      if (view_description !== undefined && typeof view_description !== 'string') {
        ResponseHelper.badRequest(res, "Descrição da visualização deve ser uma string");
        return;
      }

      if (view_page !== undefined && typeof view_page !== 'string') {
        ResponseHelper.badRequest(res, "Página da visualização deve ser uma string");
        return;
      }

      const newStepViewRaw = await prisma.step_View.create({
        data: {
          view_description: view_description?.trim() || "",
          view_page: view_page?.trim() || "",
        },
      });

      const newStepView: StepView = {
        ...newStepViewRaw
      };

      ResponseHelper.created(res, newStepView, "Visualização de passo criada com sucesso");
    } catch (error) {
      console.error("Error creating step view:", error);
      ResponseHelper.serverError(res, "Falha ao criar visualização de passo");
    }
  }

  // Create New Step Questionnaire
  async createNewStepQuestionnaire(req: Request<{}, {}, CreateStepQuestionnaireRequest>, res: Response): Promise<void> {
    try {
      const { questionnaire_description, questionnaire_json }: CreateStepQuestionnaireRequest = req.body;

      if (questionnaire_description !== undefined && typeof questionnaire_description !== 'string') {
        ResponseHelper.badRequest(res, "Descrição do questionário deve ser uma string");
        return;
      }

      const newStepQuestionnaireRaw = await prisma.step_Questionnaire.create({
        data: {
          questionnaire_description: questionnaire_description?.trim() || "",
          questionnaire_json: questionnaire_json || null,
        },
      });

      const newStepQuestionnaire: StepQuestionnaire = {
        ...newStepQuestionnaireRaw
      };

      ResponseHelper.created(res, newStepQuestionnaire, "Questionário de passo criado com sucesso");
    } catch (error) {
      console.error("Error creating step questionnaire:", error);
      ResponseHelper.serverError(res, "Falha ao criar questionário de passo");
    }
  }

  // Create New Step
  async createNewStep(req: Request<{}, {}, CreateStepRequest>, res: Response): Promise<void> {
    try {
      const {
        ref_id_step_video,
        ref_id_step_bet,
        ref_id_step_view,
        ref_id_step_questionnaire,
        ref_id_challenges,
      }: CreateStepRequest = req.body;

      if (!ref_id_challenges || ref_id_challenges <= 0) {
        ResponseHelper.badRequest(res, "ID de desafio válido é obrigatório");
        return;
      }

      // Validar que pelo menos um tipo de step foi fornecido
      if (!ref_id_step_video && !ref_id_step_bet && !ref_id_step_view && !ref_id_step_questionnaire) {
        ResponseHelper.badRequest(res, "Pelo menos uma referência de tipo de passo é obrigatória");
        return;
      }

      // Validar IDs se fornecidos
      if (ref_id_step_video !== undefined && (typeof ref_id_step_video !== 'number' || ref_id_step_video <= 0)) {
        ResponseHelper.badRequest(res, "ID do vídeo de passo deve ser um número positivo");
        return;
      }

      if (ref_id_step_bet !== undefined && (typeof ref_id_step_bet !== 'number' || ref_id_step_bet <= 0)) {
        ResponseHelper.badRequest(res, "ID da aposta de passo deve ser um número positivo");
        return;
      }

      if (ref_id_step_view !== undefined && (typeof ref_id_step_view !== 'number' || ref_id_step_view <= 0)) {
        ResponseHelper.badRequest(res, "ID da visualização de passo deve ser um número positivo");
        return;
      }

      if (ref_id_step_questionnaire !== undefined && (typeof ref_id_step_questionnaire !== 'number' || ref_id_step_questionnaire <= 0)) {
        ResponseHelper.badRequest(res, "ID do questionário de passo deve ser um número positivo");
        return;
      }

      const newStepRaw = await prisma.steps.create({
        data: {
          ref_id_step_video: ref_id_step_video || null,
          ref_id_step_bet: ref_id_step_bet || null,
          ref_id_step_view: ref_id_step_view || null,
          ref_id_step_questionnaire: ref_id_step_questionnaire || null,
          ref_id_challenges,
        },
      });

      const newStep: Step = {
        ...newStepRaw
      };

      ResponseHelper.created(res, newStep, "Passo criado com sucesso");
    } catch (error) {
      console.error("Error creating step:", error);
      ResponseHelper.serverError(res, "Falha ao criar passo");
    }
  }

  // Update progress_percentage of Step
  async updateStepProgress(req: Request<{ id: string }, {}, UpdateStepProgressRequest>, res: Response): Promise<void> {
    try {
      const challengeId: number = parseInt(req.params.id);
      const { progress_percentage, ref_id_user }: UpdateStepProgressRequest = req.body;

      if (isNaN(challengeId) || challengeId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de desafio inválido");
        return;
      }

      if (typeof progress_percentage !== 'number' || progress_percentage < 0 || progress_percentage > 100) {
        ResponseHelper.badRequest(res, "Percentagem de progresso deve ser um número entre 0 e 100");
        return;
      }

      if (!ref_id_user || ref_id_user <= 0) {
        ResponseHelper.badRequest(res, "ID de utilizador válido é obrigatório");
        return;
      }

      const updatedStepRaw = await prisma.user_has_Challenges.update({
        where: {
          ref_id_user_ref_id_challenge: {
            ref_id_challenge: challengeId,
            ref_id_user: ref_id_user,
          },
        },
        data: { progress_percentage },
      });

      ResponseHelper.success(res, updatedStepRaw, "Progresso do passo atualizado com sucesso");
    } catch (error) {
      console.error("Error updating step progress:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar progresso do passo");
    }
  }

  // Update Step Video
  async updateStepVideo(req: Request<{ id_video: string }, {}, UpdateStepVideoRequest>, res: Response): Promise<void> {
    try {
      const videoId: number = parseInt(req.params.id_video);
      const { video_url, video_description }: UpdateStepVideoRequest = req.body;

      if (isNaN(videoId) || videoId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de vídeo inválido");
        return;
      }

      if (video_url !== undefined && (typeof video_url !== 'string' || video_url.trim().length === 0)) {
        ResponseHelper.badRequest(res, "URL do vídeo deve ser uma string não vazia");
        return;
      }

      if (video_description !== undefined && typeof video_description !== 'string') {
        ResponseHelper.badRequest(res, "Descrição do vídeo deve ser uma string");
        return;
      }

      // Verificar se o video existe
      const existingVideo = await prisma.step_Video.findUnique({
        where: { id_step_video: videoId },
      });

      if (!existingVideo) {
        ResponseHelper.notFound(res, `Vídeo de passo com ID ${videoId} não encontrado`);
        return;
      }

      const updatedStepVideoRaw = await prisma.step_Video.update({
        where: { id_step_video: videoId },
        data: { 
          video_url: video_url?.trim() || existingVideo.video_url,
          video_description: video_description?.trim() || existingVideo.video_description
        },
      });

      const updatedStepVideo: StepVideo = {
        ...updatedStepVideoRaw
      };

      ResponseHelper.success(res, updatedStepVideo, "Vídeo de passo atualizado com sucesso");
    } catch (error) {
      console.error("Error updating step video:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar vídeo de passo");
    }
  }

  // Update Step Bet
  async updateStepBet(req: Request<{ id_bet: string }, {}, UpdateStepBetRequest>, res: Response): Promise<void> {
    try {
      const betId: number = parseInt(req.params.id_bet);
      const { bet_description }: UpdateStepBetRequest = req.body;

      if (isNaN(betId) || betId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de aposta inválido");
        return;
      }

      if (bet_description !== undefined && typeof bet_description !== 'string') {
        ResponseHelper.badRequest(res, "Descrição da aposta deve ser uma string");
        return;
      }

      // Verificar se o bet existe
      const existingBet = await prisma.step_Bet.findUnique({
        where: { id_step_bet: betId },
      });

      if (!existingBet) {
        ResponseHelper.notFound(res, `Aposta de passo com ID ${betId} não encontrada`);
        return;
      }

      const updatedStepBetRaw = await prisma.step_Bet.update({
        where: { id_step_bet: betId },
        data: { bet_description: bet_description?.trim() || existingBet.bet_description },
      });

      const updatedStepBet: StepBet = {
        ...updatedStepBetRaw
      };

      ResponseHelper.success(res, updatedStepBet, "Aposta de passo atualizada com sucesso");
    } catch (error) {
      console.error("Error updating step bet:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar aposta de passo");
    }
  }

  // Update Step View
  async updateStepView(req: Request<{ id_view: string }, {}, UpdateStepViewRequest>, res: Response): Promise<void> {
    try {
      const viewId: number = parseInt(req.params.id_view);
      const { view_description, view_page }: UpdateStepViewRequest = req.body;

      if (isNaN(viewId) || viewId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de visualização inválido");
        return;
      }

      if (view_description !== undefined && typeof view_description !== 'string') {
        ResponseHelper.badRequest(res, "Descrição da visualização deve ser uma string");
        return;
      }

      if (view_page !== undefined && typeof view_page !== 'string') {
        ResponseHelper.badRequest(res, "Página da visualização deve ser uma string");
        return;
      }

      // Verificar se o view existe
      const existingView = await prisma.step_View.findUnique({
        where: { id_step_view: viewId },
      });

      if (!existingView) {
        ResponseHelper.notFound(res, `Visualização de passo com ID ${viewId} não encontrada`);
        return;
      }

      const updatedStepViewRaw = await prisma.step_View.update({
        where: { id_step_view: viewId },
        data: { 
          view_description: view_description?.trim() || existingView.view_description,
          view_page: view_page?.trim() || existingView.view_page
        },
      });

      const updatedStepView: StepView = {
        ...updatedStepViewRaw
      };

      ResponseHelper.success(res, updatedStepView, "Visualização de passo atualizada com sucesso");
    } catch (error) {
      console.error("Error updating step view:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar visualização de passo");
    }
  }

  // Update Step Questionnaire
  async updateStepQuestionnaire(req: Request<{ id_questionnaire: string }, {}, UpdateStepQuestionnaireRequest>, res: Response): Promise<void> {
    try {
      const questionnaireId: number = parseInt(req.params.id_questionnaire);
      const { questionnaire_description, questionnaire_json }: UpdateStepQuestionnaireRequest = req.body;

      if (isNaN(questionnaireId) || questionnaireId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de questionário inválido");
        return;
      }

      if (questionnaire_description !== undefined && typeof questionnaire_description !== 'string') {
        ResponseHelper.badRequest(res, "Descrição do questionário deve ser uma string");
        return;
      }

      // Verificar se o questionnaire existe
      const existingQuestionnaire = await prisma.step_Questionnaire.findUnique({
        where: { id_step_questionnaire: questionnaireId },
      });

      if (!existingQuestionnaire) {
        ResponseHelper.notFound(res, `Questionário de passo com ID ${questionnaireId} não encontrado`);
        return;
      }

      const updatedStepQuestionnaireRaw = await prisma.step_Questionnaire.update({
        where: { id_step_questionnaire: questionnaireId },
        data: { 
          questionnaire_description: questionnaire_description?.trim() || existingQuestionnaire.questionnaire_description,
          questionnaire_json: questionnaire_json !== undefined ? questionnaire_json : existingQuestionnaire.questionnaire_json
        },
      });

      const updatedStepQuestionnaire: StepQuestionnaire = {
        ...updatedStepQuestionnaireRaw
      };

      ResponseHelper.success(res, updatedStepQuestionnaire, "Questionário de passo atualizado com sucesso");
    } catch (error) {
      console.error("Error updating step questionnaire:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar questionário de passo");
    }
  }

  // Delete Step
  async deleteStep(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const stepId: number = parseInt(req.params.id);

      if (isNaN(stepId) || stepId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de passo inválido");
        return;
      }

      // Verificar se o step existe
      const existingStep = await prisma.steps.findUnique({
        where: { id_step: stepId },
      });

      if (!existingStep) {
        ResponseHelper.notFound(res, `Passo com ID ${stepId} não encontrado`);
        return;
      }

      // Verificar se existem dependências (user_has_challenges_has_steps)
      const dependentRecords = await prisma.user_has_Challenges_has_Steps.findMany({
        where: { ref_id_steps: stepId },
      });

      if (dependentRecords.length > 0) {
        ResponseHelper.conflict(res, "Não é possível eliminar o passo: tem registos de progresso de utilizador associados");
        return;
      }

      const deletedStepRaw = await prisma.steps.delete({
        where: { id_step: stepId },
      });

      const deletedStep: Step = {
        ...deletedStepRaw
      };

      ResponseHelper.success(res, deletedStep, "Passo eliminado com sucesso");
    } catch (error) {
      console.error("Error deleting step:", error);
      ResponseHelper.serverError(res, "Falha ao eliminar passo");
    }
  }
}