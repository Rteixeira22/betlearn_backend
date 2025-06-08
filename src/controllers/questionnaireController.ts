import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { 
  ResponseHelper, 
  QuestionnaireResponse, 
  CreateQuestionnaireRequest, 
  UpdateQuestionnaireRequest 
} from "../utils/questionnaireResponseHelper";

const prisma = new PrismaClient();

export class QuestionnaireController {
  // Get all questionnaires
  async getAllQuestionnaires(req: Request, res: Response): Promise<void> {
    try {
      const responsesRaw = await prisma.questionnaire_Response.findMany({
        orderBy: {
          id_questionnaire_response: 'desc'
        }
      });

      const responses: QuestionnaireResponse[] = responsesRaw.map(response => ({
        ...response,
        verification: response.verification ?? false
      }));

      ResponseHelper.success(res, responses, "Questionnaires retrieved successfully");
    } catch (error) {
      console.error("Error fetching questionnaires:", error);
      ResponseHelper.serverError(res, "Failed to fetch questionnaires");
    }
  }

  // Get a questionnaire by ID
  async getQuestionnaireById(req: Request, res: Response): Promise<void> {
    try {
      const questionnaireId: number = parseInt(req.params.id);
      
      if (isNaN(questionnaireId) || questionnaireId <= 0) {
        ResponseHelper.badRequest(res, "Invalid questionnaire ID format");
        return;
      }

      const responseRaw = await prisma.questionnaire_Response.findUnique({
        where: { id_questionnaire_response: questionnaireId },
      });

      if (!responseRaw) {
        ResponseHelper.notFound(res, `Questionnaire with ID ${questionnaireId} not found`);
        return;
      }

      const response: QuestionnaireResponse = {
        ...responseRaw,
        verification: responseRaw.verification ?? false
      };

      ResponseHelper.success(res, response, "Questionnaire retrieved successfully");
    } catch (error) {
      console.error("Error fetching questionnaire by ID:", error);
      ResponseHelper.serverError(res, "Failed to fetch questionnaire");
    }
  }

  // Get all questionnaire responses by user ID
  async getQuestionnaireByUserId(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.userId);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }
      
      const responsesRaw = await prisma.questionnaire_Response.findMany({
        where: { ref_id_user: requestedId },
        orderBy: { id_questionnaire_response: 'desc' }
      });

      const responses: QuestionnaireResponse[] = responsesRaw.map(response => ({
        ...response,
        verification: response.verification ?? false
      }));

      ResponseHelper.success(res, responses, "User questionnaire responses retrieved successfully");
    } catch (error) {
      console.error("Error fetching questionnaire responses by user ID:", error);
      ResponseHelper.serverError(res, "Failed to fetch questionnaire responses");
    }
  }

  // Get verified questionnaire responses by user ID
  async getVerifiedQuestionnaires(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.userId);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }

      const responsesRaw = await prisma.questionnaire_Response.findMany({
        where: { ref_id_user: requestedId, verification: true },
        orderBy: { id_questionnaire_response: 'desc' }
      });

      const responses: QuestionnaireResponse[] = responsesRaw.map(response => ({
        ...response,
        verification: response.verification ?? false
      }));

      ResponseHelper.success(res, responses, "Verified questionnaire responses retrieved successfully");
    } catch (error) {
      console.error("Error fetching verified questionnaire responses:", error);
      ResponseHelper.serverError(res, "Failed to fetch verified questionnaire responses");
    }
  }

  // Get unverified questionnaire responses by user ID
  async getUnverifiedQuestionnaires(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.userId);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }
      
      const responsesRaw = await prisma.questionnaire_Response.findMany({
        where: { ref_id_user: requestedId, verification: false },
        orderBy: { id_questionnaire_response: 'desc' }
      });

      const responses: QuestionnaireResponse[] = responsesRaw.map(response => ({
        ...response,
        verification: response.verification ?? false
      }));

      ResponseHelper.success(res, responses, "Unverified questionnaire responses retrieved successfully");
    } catch (error) {
      console.error("Error fetching unverified questionnaire responses:", error);
      ResponseHelper.serverError(res, "Failed to fetch unverified questionnaire responses");
    }
  }

  // Get the last questionnaire response by user ID
  async getLastQuestionnaireResponse(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.userId);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Invalid user ID format");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Access denied");
        return;
      }

      const responseRaw = await prisma.questionnaire_Response.findFirst({
        where: { ref_id_user: requestedId },
        orderBy: { id_questionnaire_response: "desc" },
      });

      if (!responseRaw) {
        ResponseHelper.notFound(res, "No questionnaire response found for this user");
        return;
      }

      const response: QuestionnaireResponse = {
        ...responseRaw,
        verification: responseRaw.verification ?? false
      };

      ResponseHelper.success(res, response, "Last questionnaire response retrieved successfully");
    } catch (error) {
      console.error("Error fetching last questionnaire response:", error);
      ResponseHelper.serverError(res, "Failed to fetch the last questionnaire response");
    }
  }

  // Create a new questionnaire response
  async createQuestionnaireResponse(req: Request<{}, {}, CreateQuestionnaireRequest>, res: Response): Promise<void> {
    try {
      const {
        budget,
        verification,
        salary,
        expenses,
        available_amount,
        debt,
        debt_monthly,
        income_source,
        ref_id_user,
      }: CreateQuestionnaireRequest = req.body;

      // Validações básicas
      if (typeof verification !== 'boolean') {
        ResponseHelper.badRequest(res, "Verification field is required and must be a boolean");
        return;
      }

      if (!ref_id_user || ref_id_user <= 0) {
        ResponseHelper.badRequest(res, "Valid user ID is required");
        return;
      }

      // Validações opcionais para campos numéricos
      if (budget !== undefined && (typeof budget !== 'number' || budget < 0)) {
        ResponseHelper.badRequest(res, "Budget must be a positive number");
        return;
      }

      if (salary !== undefined && (typeof salary !== 'number' || salary < 0)) {
        ResponseHelper.badRequest(res, "Salary must be a positive number");
        return;
      }

      if (expenses !== undefined && (typeof expenses !== 'number' || expenses < 0)) {
        ResponseHelper.badRequest(res, "Expenses must be a positive number");
        return;
      }

      if (available_amount !== undefined && (typeof available_amount !== 'number' || available_amount < 0)) {
        ResponseHelper.badRequest(res, "Available amount must be a positive number");
        return;
      }

      if (debt !== undefined && (typeof debt !== 'number' || debt < 0)) {
        ResponseHelper.badRequest(res, "Debt must be a positive number");
        return;
      }

      if (debt_monthly !== undefined && (typeof debt_monthly !== 'number' || debt_monthly < 0)) {
        ResponseHelper.badRequest(res, "Monthly debt must be a positive number");
        return;
      }

      if (income_source !== undefined && typeof income_source !== 'string') {
        ResponseHelper.badRequest(res, "Income source must be a string");
        return;
      }

      const newResponseRaw = await prisma.questionnaire_Response.create({
        data: {
          budget,
          verification,
          salary,
          expenses,
          available_amount,
          debt,
          debt_monthly,
          income_source,
          ref_id_user,
        },
      });

      const newResponse: QuestionnaireResponse = {
        ...newResponseRaw,
        verification: newResponseRaw.verification ?? false
      };

      ResponseHelper.created(res, newResponse, "Questionnaire response created successfully");
    } catch (error) {
      console.error("Error creating questionnaire response:", error);
      ResponseHelper.serverError(res, "Failed to create questionnaire response");
    }
  }

  // Update a specific questionnaire response
  async updateQuestionnaireResponse(req: Request<{ id: string }, {}, UpdateQuestionnaireRequest>, res: Response): Promise<void> {
    try {
      const questionnaireId: number = parseInt(req.params.id);
      const {
        budget,
        verification,
        salary,
        expenses,
        available_amount,
        debt,
        debt_monthly,
        income_source,
      }: UpdateQuestionnaireRequest = req.body;

      if (isNaN(questionnaireId) || questionnaireId <= 0) {
        ResponseHelper.badRequest(res, "Invalid questionnaire ID format");
        return;
      }

      // Verificar se o questionário existe
      const existingResponse = await prisma.questionnaire_Response.findUnique({
        where: { id_questionnaire_response: questionnaireId },
      });

      if (!existingResponse) {
        ResponseHelper.notFound(res, `Questionnaire with ID ${questionnaireId} not found`);
        return;
      }

      // Validações para campos que estão sendo atualizados
      if (verification !== undefined && typeof verification !== 'boolean') {
        ResponseHelper.badRequest(res, "Verification must be a boolean");
        return;
      }

      if (budget !== undefined && (typeof budget !== 'number' || budget < 0)) {
        ResponseHelper.badRequest(res, "Budget must be a positive number");
        return;
      }

      if (salary !== undefined && (typeof salary !== 'number' || salary < 0)) {
        ResponseHelper.badRequest(res, "Salary must be a positive number");
        return;
      }

      if (expenses !== undefined && (typeof expenses !== 'number' || expenses < 0)) {
        ResponseHelper.badRequest(res, "Expenses must be a positive number");
        return;
      }

      if (available_amount !== undefined && (typeof available_amount !== 'number' || available_amount < 0)) {
        ResponseHelper.badRequest(res, "Available amount must be a positive number");
        return;
      }

      if (debt !== undefined && (typeof debt !== 'number' || debt < 0)) {
        ResponseHelper.badRequest(res, "Debt must be a positive number");
        return;
      }

      if (debt_monthly !== undefined && (typeof debt_monthly !== 'number' || debt_monthly < 0)) {
        ResponseHelper.badRequest(res, "Monthly debt must be a positive number");
        return;
      }

      if (income_source !== undefined && typeof income_source !== 'string') {
        ResponseHelper.badRequest(res, "Income source must be a string");
        return;
      }

      const updatedResponseRaw = await prisma.questionnaire_Response.update({
        where: { id_questionnaire_response: questionnaireId },
        data: {
          budget,
          verification,
          salary,
          expenses,
          available_amount,
          debt,
          debt_monthly,
        },
      });

      const updatedResponse: QuestionnaireResponse = {
        ...updatedResponseRaw,
        verification: updatedResponseRaw.verification ?? false
      };

      ResponseHelper.success(res, updatedResponse, "Questionnaire response updated successfully");
    } catch (error) {
      console.error("Error updating questionnaire response:", error);
      ResponseHelper.serverError(res, "Failed to update questionnaire response");
    }
  }

  // Delete a specific questionnaire response
  async deleteQuestionnaireResponse(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const questionnaireId: number = parseInt(req.params.id);

      if (isNaN(questionnaireId) || questionnaireId <= 0) {
        ResponseHelper.badRequest(res, "Invalid questionnaire ID format");
        return;
      }

      const existingResponse = await prisma.questionnaire_Response.findUnique({
        where: { id_questionnaire_response: questionnaireId },
      });

      if (!existingResponse) {
        ResponseHelper.notFound(res, `Questionnaire with ID ${questionnaireId} not found`);
        return;
      }

      await prisma.questionnaire_Response.delete({
        where: { id_questionnaire_response: questionnaireId },
      });

      ResponseHelper.success(res, null, "Questionnaire response deleted successfully");
    } catch (error) {
      console.error("Error deleting questionnaire response:", error);
      ResponseHelper.serverError(res, "Failed to delete questionnaire response");
    }
  }
}