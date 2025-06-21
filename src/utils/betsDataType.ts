import { Decimal } from "@prisma/client/runtime/library";

// Tipos para o modelo Bet
export interface Bet {
  id_bets: number;
  date: Date;
  type: number;
  amount: number | Decimal;
  potential_earning: number | Decimal;
  odd:  number | Decimal;
  ref?: number;
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
  odd: number | Decimal;
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