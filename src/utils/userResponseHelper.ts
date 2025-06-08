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

// User-related types
export interface User {
  id_user: number;
  name: string;
  email: string;
  username: string;
  birthdate: Date;
  password: string;
  image?: string | null;
  money: number;
  points: number;
  tutorial_verification: number;
  bets_visibility?: number;
  has_accepted_terms?: boolean;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface UserChallenge {
  ref_id_user: number;
  ref_id_challenge: number;
  challenge: {
    id_challenge: number;
    name: string;
    description: string;
    points: number;
    active: number;
  };
}

export interface UserBet {
  id_bet: number;
  ref_id_user: number;
  amount: number;
  odds: number;
  state: number; 
  result?: number; 
  created_at: Date;
  updated_at?: Date;
}

export interface LeaderboardEntry {
  id_user: number;
  name: string;
  username: string;
  points: number;
  image?: string | null;
}

// Request types
export interface CreateUserRequest {
  name: string;
  email: string;
  username: string;
  birthdate: string;
  password: string;
  image?: string;
  money?: number;
  points?: number;
  tutorial_verification?: boolean;
  has_accepted_terms?: boolean;
}

export interface UpdateUserProfileRequest {
  name?: string;
  email?: string;
  username?: string;
  image?: string;
}

export interface UpdateUserPasswordRequest {
  password: string;
}

export interface UpdateUserMoneyRequest {
  money: number;
}

export interface UpdateUserPointsRequest {
  points: number;
}

export interface UpdateUserBetsVisibilityRequest {
  bets_visibility: boolean;
}

export interface UpdateUserTutorialVerificationRequest {
  tutorial_verification: boolean;
}