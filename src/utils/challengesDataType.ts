
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