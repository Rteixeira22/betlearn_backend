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

// Tipos para o modelo Bet
export interface Bet {
  id_bets: number;
  date: Date;
  type: string;
  amount: number;
  potential_earning: number;
  odd: number;
  ref?: string;
  state: number;
  result?: number;
  ref_id_user: number;
  created_at?: Date;
  updated_at?: Date;
}

// Tipo para Bet com relações incluídas
export interface BetWithGames extends Bet {
  BetsHasGames: BetHasGame[];
}

export interface BetHasGame {
  ref_id_game: number;
  ref_id_bet: number;
  ref_id_championship: number;
  game: Game;
}

export interface Game {
  id_game: number;
  local_team: string;
  visitor_team: string;
  schedule: Date;
  betted_team: string;
  odd: number;
  goals_local_team?: number;
  goals_visitor_team?: number;
  image?: string;
  game_state: number;
}

// Tipos para requests
export interface CreateBetRequest {
  type: string;
  amount: number;
  potential_earning: number;
  odd_bet: number;
  ref?: string;
  state: number;
  result?: number;
  // Game data
  local_team: string;
  visitor_team: string;
  schedule: string | Date;
  betted_team: string;
  odd_game: number;
  goals_local_team?: number;
  goals_visitor_team?: number;
  image?: string;
  game_state?: number;
}

export interface UpdateBetRequest {
  state?: number;
  result?: number;
}

export interface BetFiltersQuery {
  state?: "0" | "1";
  result?: "0" | "1";
  cursor?: string;
  limit?: string;
  offset?: string;
}

// Tipo para resposta de paginação
export interface PaginatedBetsResponse {
  bets: BetWithGames[];
  pagination: {
    total: number;
    limit?: number;
    offset: number;
    hasNextPage: boolean;
  };
}

// Tipo para contagem de apostas
export interface BetCountResponse {
  count: number;
}

// Tipo para criação de aposta com transação
export interface CreateBetTransactionResponse {
  bet: Bet;
  game: Game;
  betsHasGames: BetHasGame;
}