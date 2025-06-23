
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