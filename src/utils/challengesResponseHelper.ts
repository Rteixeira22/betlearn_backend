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

// Challenge types
export interface Challenge {
  id_challenge: number;
  number: number;
  name: string;
  short_description: string;
  long_description: string;
  image: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ChallengeWithSteps extends Challenge {
  Steps?: Step[];
}

export interface Step {
  id_step: number;
  ref_id_step_video?: number | null;
  ref_id_step_bet?: number | null;
  ref_id_step_view?: number | null;
  ref_id_step_questionnaire?: number | null;
  ref_id_challenges: number;
  Step_Video?: StepVideo | null;
  Step_Bet?: StepBet | null;
  Step_View?: StepView | null;
  Step_Questionnaire?: StepQuestionnaire | null;
}

export interface StepVideo {
  id_step_video: number;
  video_url: string;
  video_description: string;
}

export interface StepBet {
  id_step_bet: number;
  bet_description: string;
}

export interface StepView {
  id_step_view: number;
  view_description: string;
  view_page: string;
}

export interface StepQuestionnaire {
  id_step_questionnaire: number;
  questionnaire_description: string;
  questionnaire_json: string;
}

export interface UserHasChallenge {
  ref_id_user: number;
  ref_id_challenge: number;
  completed: boolean;
  blocked: boolean;
  detail_seen: boolean;
  progress_percentage: number;
  date?: Date;
  challenge?: Challenge;
}

export interface UserHasChallengeStep {
  ref_user_has_Challenges_id_user: number;
  ref_user_has_Challenges_id_challenge: number;
  ref_id_steps: number;
  state: number;
  step?: Step;
}

// Request types
export interface CreateChallengeRequest {
  number: number;
  name: string;
  short_description: string;
  long_description: string;
  image: string;
}

export interface UpdateChallengeRequest {
  name?: string;
  short_description?: string;
  long_description?: string;
  image?: string;
}

export interface CreateUserHasChallengeRequest {
  completed: boolean;
  blocked: boolean;
  detail_seen: boolean;
}

export interface UpdateUserHasChallengeDetailSeenRequest {
  detail_seen: boolean;
}

export interface UpdateUserHasChallengeProgressRequest {
  progress_percentage: number;
}

export interface UpdateUserHasStepStateRequest {
  state: number;
}

export interface CreateStepData {
  video_url?: string;
  video_description?: string;
  bet_description?: string;
  bet_json?: string;
  view_description?: string;
  view_page?: string;
  questionnaire_description?: string;
  questionnaire_json?: string;
}

export interface CreateStepRequest {
  type: "video" | "bet" | "view" | "questionnaire";
  data: CreateStepData;
}

export interface CreateFullChallengeRequest {
  challenge: CreateChallengeRequest;
  steps: CreateStepRequest[];
}

// Response types
export interface ChallengeListResponse {
  challenges: Challenge[];
  pagination: {
    total: number;
    limit?: number;
    offset: number;
    hasNextPage: boolean;
  };
}

export interface ChallengeCountResponse {
  count: number;
}

export interface MostCompletedChallengeResponse {
  mostCompleted: Challenge | null;
  completionCount?: number;
  date?: string;
  message?: string;
}

export interface ChallengeInProgressResponse {
  challenge: Challenge;
  progress: {
    progress_percentage: number;
    detail_seen: boolean;
  };
  steps: UserHasChallengeStep[];
}

export interface StepUpdateResponse {
  message: string;
  progress_percentage: number;
  updatedStep: any;
  total_steps: number;
  debug_logs?: string[];
}