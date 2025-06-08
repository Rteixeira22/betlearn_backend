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

// Tipos para o modelo AdminNotification
export interface AdminNotification {
  id_notification: number;
  title: string;
  message: string;
  type: string;
  source: string;
  is_read: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para requests
export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: string;
  source: string;
}

export interface UpdateNotificationRequest {
  title?: string;
  message?: string;
  is_read?: boolean;
}

export interface MarkAsReadRequest {
  is_read: boolean;
}

// Tipo para filtros de query
export interface NotificationFilters {
  is_read?: boolean;
}