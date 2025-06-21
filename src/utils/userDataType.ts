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