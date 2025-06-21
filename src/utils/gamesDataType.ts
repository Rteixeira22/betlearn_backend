
// Types for Game model
export interface Game {
  id_game: number;
  local_team: string;
  visitor_team: string;
  schedule: Date;
  betted_team?: string | null;
  odd?: number | null;
  goals_local_team?: number | null;
  goals_visitor_team?: number | null;
  image?: string | null;
  game_state: number;
}

// Types for requests
export interface CreateGameRequest {
  local_team: string;
  visitor_team: string;
  schedule: string | Date;
  betted_team?: string | null;
  odd?: number | null;
  goals_local_team?: number | null;
  goals_visitor_team?: number | null;
  image?: string | null;
  game_state?: number;
}

// Types for specific responses
export interface UpdateGameStateResponse {
  game: Game;
  bet_updated: boolean;
  unfinished_games_count: number;
}

export interface MostBettedGameResponse {
  game: Game;
  bet_count: number;
  championship_json: string | null;
}

// Types for internal use (Bet model reference)
export interface Bet {
  id_bets: number;
  date: Date;
  state: number;
}

// Types for championship data
export interface Championship {
  id_championship: number;
  json: string;
  creation_date: Date;
}

// Types for relation tables
export interface BetsHasGames {
  ref_id_bet: number;
  ref_id_game: number;
  ref_id_championship: number;
}