// Tipos para o modelo Tip
export interface Tip {
  id_tip: number;
  tip: string;
  active: number;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para requests
export interface CreateTipRequest {
  tip: string;
}

export interface UpdateTipRequest {
  tip?: string;
  active?: number;
}

export interface UpdateTipStateRequest {
  active: number;
}