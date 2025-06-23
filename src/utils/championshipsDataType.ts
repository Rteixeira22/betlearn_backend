
// Types for Championship model
export interface Championship {
  id_championship: number;
  json: string;
  creation_date: Date;
}

// Types for requests
export interface CreateChampionshipRequest {
  json: string;
}

export interface UpdateChampionshipRequest {
  json: string;
}