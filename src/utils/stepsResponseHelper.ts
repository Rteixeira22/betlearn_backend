import { Response } from "express";

export interface ApiResponseFormat<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
  statusCode: number;
}

export class ResponseHelper {
  private static formatResponse<T>(
    statusCode: number,
    success: boolean,
    message: string,
    data: T | null = null
  ): ApiResponseFormat<T> {
    return {
      success,
      message,
      data,
      timestamp: new Date().toISOString(),
      statusCode,
    };
  }

  // Success responses (2xx)
  static ok<T>(
    res: Response,
    data: T,
    message: string = "Success"
  ): Response {
    const response = this.formatResponse(200, true, message, data);
    return res.status(200).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = "Resource created successfully"
  ): Response {
    const response = this.formatResponse(201, true, message, data);
    return res.status(201).json(response);
  }

  static noContent(
    res: Response,
    message: string = "Operation completed successfully"
  ): Response {
    const response = this.formatResponse(204, true, message, null);
    return res.status(204).json(response);
  }

  // Client error responses (4xx)
  static badRequest(
    res: Response,
    message: string = "Bad Request"
  ): Response {
    const response = this.formatResponse(400, false, message, null);
    return res.status(400).json(response);
  }

  static unauthorized(
    res: Response,
    message: string = "Unauthorized access"
  ): Response {
    const response = this.formatResponse(401, false, message, null);
    return res.status(401).json(response);
  }

  static forbidden(
    res: Response,
    message: string = "Forbidden access"
  ): Response {
    const response = this.formatResponse(403, false, message, null);
    return res.status(403).json(response);
  }

  static notFound(
    res: Response,
    message: string = "Resource not found"
  ): Response {
    const response = this.formatResponse(404, false, message, null);
    return res.status(404).json(response);
  }

  static conflict(
    res: Response,
    message: string = "Resource conflict"
  ): Response {
    const response = this.formatResponse(409, false, message, null);
    return res.status(409).json(response);
  }

  static unprocessableEntity(
    res: Response,
    message: string = "Validation failed"
  ): Response {
    const response = this.formatResponse(422, false, message, null);
    return res.status(422).json(response);
  }

  // Server error responses (5xx)
  static serverError(
    res: Response,
    message: string = "Internal server error"
  ): Response {
    const response = this.formatResponse(500, false, message, null);
    return res.status(500).json(response);
  }

  static serviceUnavailable(
    res: Response,
    message: string = "Service temporarily unavailable"
  ): Response {
    const response = this.formatResponse(503, false, message, null);
    return res.status(503).json(response);
  }

  // Convenience methods with aliases
  static success = this.ok;
  static error = this.serverError;
}

// Tipos para o modelo Steps
export interface Step {
  id_step: number;
  ref_id_step_video?: number | null;
  ref_id_step_bet?: number | null;
  ref_id_step_view?: number | null;
  ref_id_step_questionnaire?: number | null;
  ref_id_challenges: number;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para Step Video
export interface StepVideo {
  id_step_video: number;
  video_url: string;
  video_description?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para Step Bet
export interface StepBet {
  id_step_bet: number;
  bet_description?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para Step View
export interface StepView {
  id_step_view: number;
  view_description?: string | null;
  view_page?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para Step Questionnaire
export interface StepQuestionnaire {
  id_step_questionnaire: number;
  questionnaire_description?: string | null;
  questionnaire_json?: any | null;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para User has Challenges has Steps
export interface UserHasChallengesHasSteps {
  ref_user_has_Challenges_id_user: number;
  ref_user_has_Challenges_id_challenge: number;
  ref_id_steps: number;
  completed?: boolean | null;
  completion_date?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para requests - Step Video
export interface CreateStepVideoRequest {
  video_url: string;
  video_description?: string;
}

export interface UpdateStepVideoRequest {
  video_url?: string;
  video_description?: string;
}

// Tipos para requests - Step Bet
export interface CreateStepBetRequest {
  bet_description?: string;
}

export interface UpdateStepBetRequest {
  bet_description?: string;
}

// Tipos para requests - Step View
export interface CreateStepViewRequest {
  view_description?: string;
  view_page?: string;
}

export interface UpdateStepViewRequest {
  view_description?: string;
  view_page?: string;
}

// Tipos para requests - Step Questionnaire
export interface CreateStepQuestionnaireRequest {
  questionnaire_description?: string;
  questionnaire_json?: any;
}

export interface UpdateStepQuestionnaireRequest {
  questionnaire_description?: string;
  questionnaire_json?: any;
}

// Tipos para requests - Step
export interface CreateStepRequest {
  ref_id_step_video?: number;
  ref_id_step_bet?: number;
  ref_id_step_view?: number;
  ref_id_step_questionnaire?: number;
  ref_id_challenges: number;
}

// Tipos para requests - Update Progress
export interface UpdateStepProgressRequest {
  progress_percentage: number;
  ref_id_user: number;
}