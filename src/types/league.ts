export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string;
}

export interface Season {
  strSeason: string;
  strBadge?: string;
}

export interface ApiResponse<T> {
  data: T;
  timestamp: number;
}