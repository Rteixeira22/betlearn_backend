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