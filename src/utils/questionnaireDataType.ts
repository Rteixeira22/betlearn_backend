import { Decimal } from "@prisma/client/runtime/library";

export interface QuestionnaireResponse {
  id_questionnaire_response: number;
  budget?: number | Decimal | null;
  verification: boolean;
  salary?: number | null;
  expenses?: number | null;
  available_amount?: number | null;
  debt?: number | null;
  debt_monthly?: number | Decimal | null;
  income_source?: string | number | null; // Aceita ambos os tipos
  ref_id_user: number;
  created_at?: Date;
  updated_at?: Date;
}

// Interfaces para requests (mantém como number para facilitar o input)
export interface CreateQuestionnaireRequest {
  budget?: number;
  verification: boolean;
  salary?: number;
  expenses?: number;
  available_amount?: number;
  debt?: number;
  debt_monthly?: number;
  income_source?: string;
  ref_id_user: number;
}

export interface UpdateQuestionnaireRequest {
  budget?: number;
  verification?: boolean;
  salary?: number;
  expenses?: number;
  available_amount?: number;
  debt?: number;
  debt_monthly?: number;
  income_source?: string;
}