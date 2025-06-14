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

      ResponseHelper.success(res, responses, "Questionários obtidos com sucesso");
    } catch (error) {
      console.error("Error fetching questionnaires:", error);
      ResponseHelper.serverError(res, "Falha ao obter questionários");
    }
  }

  // Get a questionnaire by ID
  async getQuestionnaireById(req: Request, res: Response): Promise<void> {
    try {
      const questionnaireId: number = parseInt(req.params.id);
      
      if (isNaN(questionnaireId) || questionnaireId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de questionário inválido");
        return;
      }

      const responseRaw = await prisma.questionnaire_Response.findUnique({
        where: { id_questionnaire_response: questionnaireId },
      });

      if (!responseRaw) {
        ResponseHelper.notFound(res, `Questionário com ID ${questionnaireId} não encontrado`);
        return;
      }

      const response: QuestionnaireResponse = {
        ...responseRaw,
        verification: responseRaw.verification ?? false
      };

      ResponseHelper.success(res, response, "Questionário obtido com sucesso");
    } catch (error) {
      console.error("Error fetching questionnaire by ID:", error);
      ResponseHelper.serverError(res, "Falha ao obter questionário");
    }
  }

  // Get all questionnaire responses by user ID
  async getQuestionnaireByUserId(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.userId);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
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

      ResponseHelper.success(res, responses, "Respostas de questionário do utilizador obtidas com sucesso");
    } catch (error) {
      console.error("Error fetching questionnaire responses by user ID:", error);
      ResponseHelper.serverError(res, "Falha ao obter respostas de questionário");
    }
  }

  // Get verified questionnaire responses by user ID
  async getVerifiedQuestionnaires(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.userId);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
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

      ResponseHelper.success(res, responses, "Respostas de questionário verificadas obtidas com sucesso");
    } catch (error) {
      console.error("Error fetching verified questionnaire responses:", error);
      ResponseHelper.serverError(res, "Falha ao obter respostas de questionário verificadas");
    }
  }

  // Get unverified questionnaire responses by user ID
  async getUnverifiedQuestionnaires(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.userId);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
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

      ResponseHelper.success(res, responses, "Respostas de questionário não verificadas obtidas com sucesso");
    } catch (error) {
      console.error("Error fetching unverified questionnaire responses:", error);
      ResponseHelper.serverError(res, "Falha ao obter respostas de questionário não verificadas");
    }
  }

  // Get the last questionnaire response by user ID
  async getLastQuestionnaireResponse(req: Request, res: Response): Promise<void> {
    try {
      const role = req.userRole;
      const requestedId = parseInt(req.params.userId);
      const tokenUserId = parseInt(req.userId!);

      if (isNaN(requestedId) || requestedId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de utilizador inválido");
        return;
      }

      if (role !== 'admin' && requestedId !== tokenUserId) {
        ResponseHelper.forbidden(res, "Acesso não autorizado");
        return;
      }

      const responseRaw = await prisma.questionnaire_Response.findFirst({
        where: { ref_id_user: requestedId },
        orderBy: { id_questionnaire_response: "desc" },
      });

      if (!responseRaw) {
        ResponseHelper.notFound(res, "Nenhuma resposta de questionário encontrada para este utilizador");
        return;
      }

      const response: QuestionnaireResponse = {
        ...responseRaw,
        verification: responseRaw.verification ?? false
      };

      ResponseHelper.success(res, response, "Última resposta de questionário obtida com sucesso");
    } catch (error) {
      console.error("Error fetching last questionnaire response:", error);
      ResponseHelper.serverError(res, "Falha ao obter a última resposta de questionário");
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

      if (typeof verification !== 'boolean') {
        ResponseHelper.badRequest(res, "Campo de verificação é obrigatório e deve ser booleano");
        return;
      }

      if (!ref_id_user || ref_id_user <= 0) {
        ResponseHelper.badRequest(res, "ID de utilizador válido é obrigatório");
        return;
      }


      if (salary !== undefined && (typeof salary !== 'number' || salary < 0)) {
        ResponseHelper.badRequest(res, "Salário deve ser um número positivo");
        return;
      }

      if (expenses !== undefined && (typeof expenses !== 'number' || expenses < 0)) {
        ResponseHelper.badRequest(res, "Despesas devem ser um número positivo");
        return;
      }

      if (available_amount !== undefined && (typeof available_amount !== 'number' || available_amount < 0)) {
        ResponseHelper.badRequest(res, "Montante disponível deve ser um número positivo");
        return;
      }

      if (debt !== undefined && (typeof debt !== 'number' || debt < 0)) {
        ResponseHelper.badRequest(res, "Dívida deve ser um número positivo");
        return;
      }

      if (debt_monthly !== undefined && (typeof debt_monthly !== 'number' || debt_monthly < 0)) {
        ResponseHelper.badRequest(res, "Dívida mensal deve ser um número positivo");
        return;
      }

      if (income_source !== undefined && typeof income_source !== 'string') {
        ResponseHelper.badRequest(res, "Fonte de rendimento deve ser uma string");
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

      ResponseHelper.created(res, newResponse, "Resposta de questionário criada com sucesso");
    } catch (error) {
      console.error("Error creating questionnaire response:", error);
      ResponseHelper.serverError(res, "Falha ao criar resposta de questionário");
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
        ResponseHelper.badRequest(res, "Formato de ID de questionário inválido");
        return;
      }

      // Verificar se o questionário existe
      const existingResponse = await prisma.questionnaire_Response.findUnique({
        where: { id_questionnaire_response: questionnaireId },
      });

      if (!existingResponse) {
        ResponseHelper.notFound(res, `Questionário com ID ${questionnaireId} não encontrado`);
        return;
      }

      // Validações para campos que estão sendo atualizados
      if (verification !== undefined && typeof verification !== 'boolean') {
        ResponseHelper.badRequest(res, "Verificação deve ser booleana");
        return;
      }

      if (budget !== undefined && (typeof budget !== 'number' || budget < 0)) {
        ResponseHelper.badRequest(res, "Orçamento deve ser um número positivo");
        return;
      }

      if (salary !== undefined && (typeof salary !== 'number' || salary < 0)) {
        ResponseHelper.badRequest(res, "Salário deve ser um número positivo");
        return;
      }

      if (expenses !== undefined && (typeof expenses !== 'number' || expenses < 0)) {
        ResponseHelper.badRequest(res, "Despesas devem ser um número positivo");
        return;
      }

      if (available_amount !== undefined && (typeof available_amount !== 'number' || available_amount < 0)) {
        ResponseHelper.badRequest(res, "Montante disponível deve ser um número positivo");
        return;
      }

      if (debt !== undefined && (typeof debt !== 'number' || debt < 0)) {
        ResponseHelper.badRequest(res, "Dívida deve ser um número positivo");
        return;
      }

      if (debt_monthly !== undefined && (typeof debt_monthly !== 'number' || debt_monthly < 0)) {
        ResponseHelper.badRequest(res, "Dívida mensal deve ser um número positivo");
        return;
      }

      if (income_source !== undefined && typeof income_source !== 'string') {
        ResponseHelper.badRequest(res, "Fonte de rendimento deve ser uma string");
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

      ResponseHelper.success(res, updatedResponse, "Resposta de questionário atualizada com sucesso");
    } catch (error) {
      console.error("Error updating questionnaire response:", error);
      ResponseHelper.serverError(res, "Falha ao atualizar resposta de questionário");
    }
  }

  // Delete a specific questionnaire response
  async deleteQuestionnaireResponse(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const questionnaireId: number = parseInt(req.params.id);

      if (isNaN(questionnaireId) || questionnaireId <= 0) {
        ResponseHelper.badRequest(res, "Formato de ID de questionário inválido");
        return;
      }

      const existingResponse = await prisma.questionnaire_Response.findUnique({
        where: { id_questionnaire_response: questionnaireId },
      });

      if (!existingResponse) {
        ResponseHelper.notFound(res, `Questionário com ID ${questionnaireId} não encontrado`);
        return;
      }

      await prisma.questionnaire_Response.delete({
        where: { id_questionnaire_response: questionnaireId },
      });

      ResponseHelper.success(res, null, "Resposta de questionário eliminada com sucesso");
    } catch (error) {
      console.error("Error deleting questionnaire response:", error);
      ResponseHelper.serverError(res, "Falha ao eliminar resposta de questionário");
    }
  }
}