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

      ResponseHelper.success(res, steps, "Steps retrieved successfully");
    } catch (error) {
      console.error("Error fetching steps:", error);
      ResponseHelper.serverError(res, "Failed to fetch steps");
    }
  }

  // Get Step by ID
  async getStepById(req: Request, res: Response): Promise<void> {
    try {
      const stepId: number = parseInt(req.params.id);
      
      if (isNaN(stepId) || stepId <= 0) {
        ResponseHelper.badRequest(res, "Invalid step ID format");
        return;
      }

      const stepRaw = await prisma.steps.findUnique({
        where: { id_step: stepId },
      });

      if (!stepRaw) {
        ResponseHelper.notFound(res, `Step with ID ${stepId} not found`);
        return;
      }

      const step: Step = {
        ...stepRaw
      };

      ResponseHelper.success(res, step, "Step retrieved successfully");
    } catch (error) {
      console.error("Error fetching step by ID:", error);
      ResponseHelper.serverError(res, "Failed to fetch step");
    }
  }

  // Get Step by ref_id_challenges
  async getStepByRefIdChallenges(req: Request, res: Response): Promise<void> {
    try {
      const refIdChallenges: number = parseInt(req.params.ref_id_challenges);
      
      if (isNaN(refIdChallenges) || refIdChallenges <= 0) {
        ResponseHelper.badRequest(res, "Invalid challenge ID format");
        return;
      }

      const stepsRaw = await prisma.steps.findMany({
        where: { ref_id_challenges: refIdChallenges },
        orderBy: { id_step: 'asc' }
      });

      const steps: Step[] = stepsRaw.map(step => ({
        ...step
      }));

      ResponseHelper.success(res, steps, "Steps for challenge retrieved successfully");
    } catch (error) {
      console.error("Error fetching steps by challenge ID:", error);
      ResponseHelper.serverError(res, "Failed to fetch steps");
    }
  }

  // Get Step by video ID
  async getStepByVideoId(req: Request, res: Response): Promise<void> {
    try {
      const videoId: number = parseInt(req.params.id_video);
      
      if (isNaN(videoId) || videoId <= 0) {
        ResponseHelper.badRequest(res, "Invalid video ID format");
        return;
      }

      const stepVideosRaw = await prisma.step_Video.findMany({
        where: { id_step_video: videoId },
      });

      const stepVideos: StepVideo[] = stepVideosRaw.map(stepVideo => ({
        ...stepVideo
      }));

      ResponseHelper.success(res, stepVideos, "Step videos retrieved successfully");
    } catch (error) {
      console.error("Error fetching step by video ID:", error);
      ResponseHelper.serverError(res, "Failed to fetch step videos");
    }
  }

  // Get Step by bet ID
  async getStepByBetId(req: Request, res: Response): Promise<void> {
    try {
      const betId: number = parseInt(req.params.id_bet);
      
      if (isNaN(betId) || betId <= 0) {
        ResponseHelper.badRequest(res, "Invalid bet ID format");
        return;
      }

      const stepBetsRaw = await prisma.step_Bet.findMany({
        where: { id_step_bet: betId },
      });

      const stepBets: StepBet[] = stepBetsRaw.map(stepBet => ({
        ...stepBet
      }));

      ResponseHelper.success(res, stepBets, "Step bets retrieved successfully");
    } catch (error) {
      console.error("Error fetching step by bet ID:", error);
      ResponseHelper.serverError(res, "Failed to fetch step bets");
    }
  }

  // Get Step by view ID
  async getStepByViewId(req: Request, res: Response): Promise<void> {
    try {
      const viewId: number = parseInt(req.params.id_view);
      
      if (isNaN(viewId) || viewId <= 0) {
        ResponseHelper.badRequest(res, "Invalid view ID format");
        return;
      }

      const stepViewsRaw = await prisma.step_View.findMany({
        where: { id_step_view: viewId },
      });

      const stepViews: StepView[] = stepViewsRaw.map(stepView => ({
        ...stepView
      }));

      ResponseHelper.success(res, stepViews, "Step views retrieved successfully");
    } catch (error) {
      console.error("Error fetching step by view ID:", error);
      ResponseHelper.serverError(res, "Failed to fetch step views");
    }
  }

  // Get Step by questionnaire ID
  async getStepByQuestionnaireId(req: Request, res: Response): Promise<void> {
    try {
      const questionnaireId: number = parseInt(req.params.id_questionnaire);
      
      if (isNaN(questionnaireId) || questionnaireId <= 0) {
        ResponseHelper.badRequest(res, "Invalid questionnaire ID format");
        return;
      }

      const stepQuestionnairesRaw = await prisma.step_Questionnaire.findMany({
        where: { id_step_questionnaire: questionnaireId },
      });

      const stepQuestionnaires: StepQuestionnaire[] = stepQuestionnairesRaw.map(stepQuestionnaire => ({
        ...stepQuestionnaire
      }));

      ResponseHelper.success(res, stepQuestionnaires, "Step questionnaires retrieved successfully");
    } catch (error) {
      console.error("Error fetching step by questionnaire ID:", error);
      ResponseHelper.serverError(res, "Failed to fetch step questionnaires");
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
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (isNaN(challengeId) || challengeId <= 0) {
        ResponseHelper.badRequest(res, "Invalid challenge ID format");
        return;
      }

      if (isNaN(stepId) || stepId <= 0) {
        ResponseHelper.badRequest(res, "Invalid step ID format");
        return;
      }

      if (role !== 'admin' && requestedUserId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
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

      ResponseHelper.success(res, userHasChallengesHasSteps, "User challenge steps retrieved successfully");
    } catch (error) {
      console.error("Error fetching user challenge steps:", error);
      ResponseHelper.serverError(res, "Failed to fetch user challenge steps");
    }
  }

  // Create New Video
  async createNewVideo(req: Request<{}, {}, CreateStepVideoRequest>, res: Response): Promise<void> {
    try {
      const { video_url, video_description }: CreateStepVideoRequest = req.body;

      if (!video_url || typeof video_url !== 'string') {
        ResponseHelper.badRequest(res, "Video URL is required and must be a valid string");
        return;
      }

      if (video_url.trim().length === 0) {
        ResponseHelper.badRequest(res, "Video URL cannot be empty");
        return;
      }

      if (video_description !== undefined && typeof video_description !== 'string') {
        ResponseHelper.badRequest(res, "Video description must be a string");
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

      ResponseHelper.created(res, newVideo, "Step video created successfully");
    } catch (error) {
      console.error("Error creating step video:", error);
      ResponseHelper.serverError(res, "Failed to create step video");
    }
  }

  // Create New Step Bet
  async createNewStepBet(req: Request<{}, {}, CreateStepBetRequest>, res: Response): Promise<void> {
    try {
      const { bet_description }: CreateStepBetRequest = req.body;

      if (bet_description !== undefined && typeof bet_description !== 'string') {
        ResponseHelper.badRequest(res, "Bet description must be a string");
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

      ResponseHelper.created(res, newStepBet, "Step bet created successfully");
    } catch (error) {
      console.error("Error creating step bet:", error);
      ResponseHelper.serverError(res, "Failed to create step bet");
    }
  }

  // Create New Step View
  async createNewStepView(req: Request<{}, {}, CreateStepViewRequest>, res: Response): Promise<void> {
    try {
      const { view_description, view_page }: CreateStepViewRequest = req.body;

      if (view_description !== undefined && typeof view_description !== 'string') {
        ResponseHelper.badRequest(res, "View description must be a string");
        return;
      }

      if (view_page !== undefined && typeof view_page !== 'string') {
        ResponseHelper.badRequest(res, "View page must be a string");
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

      ResponseHelper.created(res, newStepView, "Step view created successfully");
    } catch (error) {
      console.error("Error creating step view:", error);
      ResponseHelper.serverError(res, "Failed to create step view");
    }
  }

  // Create New Step Questionnaire
  async createNewStepQuestionnaire(req: Request<{}, {}, CreateStepQuestionnaireRequest>, res: Response): Promise<void> {
    try {
      const { questionnaire_description, questionnaire_json }: CreateStepQuestionnaireRequest = req.body;

      if (questionnaire_description !== undefined && typeof questionnaire_description !== 'string') {
        ResponseHelper.badRequest(res, "Questionnaire description must be a string");
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

      ResponseHelper.created(res, newStepQuestionnaire, "Step questionnaire created successfully");
    } catch (error) {
      console.error("Error creating step questionnaire:", error);
      ResponseHelper.serverError(res, "Failed to create step questionnaire");
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
        ResponseHelper.badRequest(res, "Valid challenge ID is required");
        return;
      }

      // Validar que pelo menos um tipo de step foi fornecido
      if (!ref_id_step_video && !ref_id_step_bet && !ref_id_step_view && !ref_id_step_questionnaire) {
        ResponseHelper.badRequest(res, "At least one step type reference is required");
        return;
      }

      // Validar IDs se fornecidos
      if (ref_id_step_video !== undefined && (typeof ref_id_step_video !== 'number' || ref_id_step_video <= 0)) {
        ResponseHelper.badRequest(res, "Step video ID must be a positive number");
        return;
      }

      if (ref_id_step_bet !== undefined && (typeof ref_id_step_bet !== 'number' || ref_id_step_bet <= 0)) {
        ResponseHelper.badRequest(res, "Step bet ID must be a positive number");
        return;
      }

      if (ref_id_step_view !== undefined && (typeof ref_id_step_view !== 'number' || ref_id_step_view <= 0)) {
        ResponseHelper.badRequest(res, "Step view ID must be a positive number");
        return;
      }

      if (ref_id_step_questionnaire !== undefined && (typeof ref_id_step_questionnaire !== 'number' || ref_id_step_questionnaire <= 0)) {
        ResponseHelper.badRequest(res, "Step questionnaire ID must be a positive number");
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

      ResponseHelper.created(res, newStep, "Step created successfully");
    } catch (error) {
      console.error("Error creating step:", error);
      ResponseHelper.serverError(res, "Failed to create step");
    }
  }

  // Update progress_percentage of Step
  async updateStepProgress(req: Request<{ id: string }, {}, UpdateStepProgressRequest>, res: Response): Promise<void> {
    try {
      const challengeId: number = parseInt(req.params.id);
      const { progress_percentage, ref_id_user }: UpdateStepProgressRequest = req.body;

      if (isNaN(challengeId) || challengeId <= 0) {
        ResponseHelper.badRequest(res, "Invalid challenge ID format");
        return;
      }

      if (typeof progress_percentage !== 'number' || progress_percentage < 0 || progress_percentage > 100) {
        ResponseHelper.badRequest(res, "Progress percentage must be a number between 0 and 100");
        return;
      }

      if (!ref_id_user || ref_id_user <= 0) {
        ResponseHelper.badRequest(res, "Valid user ID is required");
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

      ResponseHelper.success(res, updatedStepRaw, "Step progress updated successfully");
    } catch (error) {
      console.error("Error updating step progress:", error);
      ResponseHelper.serverError(res, "Failed to update step progress");
    }
  }

  // Update Step Video
  async updateStepVideo(req: Request<{ id_video: string }, {}, UpdateStepVideoRequest>, res: Response): Promise<void> {
    try {
      const videoId: number = parseInt(req.params.id_video);
      const { video_url, video_description }: UpdateStepVideoRequest = req.body;

      if (isNaN(videoId) || videoId <= 0) {
        ResponseHelper.badRequest(res, "Invalid video ID format");
        return;
      }

      if (video_url !== undefined && (typeof video_url !== 'string' || video_url.trim().length === 0)) {
        ResponseHelper.badRequest(res, "Video URL must be a non-empty string");
        return;
      }

      if (video_description !== undefined && typeof video_description !== 'string') {
        ResponseHelper.badRequest(res, "Video description must be a string");
        return;
      }

      // Verificar se o video existe
      const existingVideo = await prisma.step_Video.findUnique({
        where: { id_step_video: videoId },
      });

      if (!existingVideo) {
        ResponseHelper.notFound(res, `Step video with ID ${videoId} not found`);
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

      ResponseHelper.success(res, updatedStepVideo, "Step video updated successfully");
    } catch (error) {
      console.error("Error updating step video:", error);
      ResponseHelper.serverError(res, "Failed to update step video");
    }
  }

  // Update Step Bet
  async updateStepBet(req: Request<{ id_bet: string }, {}, UpdateStepBetRequest>, res: Response): Promise<void> {
    try {
      const betId: number = parseInt(req.params.id_bet);
      const { bet_description }: UpdateStepBetRequest = req.body;

      if (isNaN(betId) || betId <= 0) {
        ResponseHelper.badRequest(res, "Invalid bet ID format");
        return;
      }

      if (bet_description !== undefined && typeof bet_description !== 'string') {
        ResponseHelper.badRequest(res, "Bet description must be a string");
        return;
      }

      // Verificar se o bet existe
      const existingBet = await prisma.step_Bet.findUnique({
        where: { id_step_bet: betId },
      });

      if (!existingBet) {
        ResponseHelper.notFound(res, `Step bet with ID ${betId} not found`);
        return;
      }

      const updatedStepBetRaw = await prisma.step_Bet.update({
        where: { id_step_bet: betId },
        data: { bet_description: bet_description?.trim() || existingBet.bet_description },
      });

      const updatedStepBet: StepBet = {
        ...updatedStepBetRaw
      };

      ResponseHelper.success(res, updatedStepBet, "Step bet updated successfully");
    } catch (error) {
      console.error("Error updating step bet:", error);
      ResponseHelper.serverError(res, "Failed to update step bet");
    }
  }

  // Update Step View
  async updateStepView(req: Request<{ id_view: string }, {}, UpdateStepViewRequest>, res: Response): Promise<void> {
    try {
      const viewId: number = parseInt(req.params.id_view);
      const { view_description, view_page }: UpdateStepViewRequest = req.body;

      if (isNaN(viewId) || viewId <= 0) {
        ResponseHelper.badRequest(res, "Invalid view ID format");
        return;
      }

      if (view_description !== undefined && typeof view_description !== 'string') {
        ResponseHelper.badRequest(res, "View description must be a string");
        return;
      }

      if (view_page !== undefined && typeof view_page !== 'string') {
        ResponseHelper.badRequest(res, "View page must be a string");
        return;
      }

      // Verificar se o view existe
      const existingView = await prisma.step_View.findUnique({
        where: { id_step_view: viewId },
      });

      if (!existingView) {
        ResponseHelper.notFound(res, `Step view with ID ${viewId} not found`);
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

      ResponseHelper.success(res, updatedStepView, "Step view updated successfully");
    } catch (error) {
      console.error("Error updating step view:", error);
      ResponseHelper.serverError(res, "Failed to update step view");
    }
  }

  // Update Step Questionnaire
  async updateStepQuestionnaire(req: Request<{ id_questionnaire: string }, {}, UpdateStepQuestionnaireRequest>, res: Response): Promise<void> {
    try {
      const questionnaireId: number = parseInt(req.params.id_questionnaire);
      const { questionnaire_description, questionnaire_json }: UpdateStepQuestionnaireRequest = req.body;

      if (isNaN(questionnaireId) || questionnaireId <= 0) {
        ResponseHelper.badRequest(res, "Invalid questionnaire ID format");
        return;
      }

      if (questionnaire_description !== undefined && typeof questionnaire_description !== 'string') {
        ResponseHelper.badRequest(res, "Questionnaire description must be a string");
        return;
      }

      // Verificar se o questionnaire existe
      const existingQuestionnaire = await prisma.step_Questionnaire.findUnique({
        where: { id_step_questionnaire: questionnaireId },
      });

      if (!existingQuestionnaire) {
        ResponseHelper.notFound(res, `Step questionnaire with ID ${questionnaireId} not found`);
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

      ResponseHelper.success(res, updatedStepQuestionnaire, "Step questionnaire updated successfully");
    } catch (error) {
      console.error("Error updating step questionnaire:", error);
      ResponseHelper.serverError(res, "Failed to update step questionnaire");
    }
  }

  // Delete Step
  async deleteStep(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const stepId: number = parseInt(req.params.id);

      if (isNaN(stepId) || stepId <= 0) {
        ResponseHelper.badRequest(res, "Invalid step ID format");
        return;
      }

      // Verificar se o step existe
      const existingStep = await prisma.steps.findUnique({
        where: { id_step: stepId },
      });

      if (!existingStep) {
        ResponseHelper.notFound(res, `Step with ID ${stepId} not found`);
        return;
      }

      // Verificar se existem dependências (user_has_challenges_has_steps)
      const dependentRecords = await prisma.user_has_Challenges_has_Steps.findMany({
        where: { ref_id_steps: stepId },
      });

      if (dependentRecords.length > 0) {
        ResponseHelper.conflict(res, "Cannot delete step: it has associated user progress records");
        return;
      }

      const deletedStepRaw = await prisma.steps.delete({
        where: { id_step: stepId },
      });

      const deletedStep: Step = {
        ...deletedStepRaw
      };

      ResponseHelper.success(res, deletedStep, "Step deleted successfully");
    } catch (error) {
      console.error("Error deleting step:", error);
      ResponseHelper.serverError(res, "Failed to delete step");
    }
  }
}
