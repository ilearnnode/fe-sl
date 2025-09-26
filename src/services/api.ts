import type { League, Season } from './api.types';

const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3';

class ApiService {
  private seasonBadgesCache = new Map<string, Season[]>();

  async getAllLeagues(): Promise<League[]> {
    try {
      const response = await fetch(`${API_BASE}/all_leagues.php`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json() as { leagues: League[] };
      return data.leagues || [];
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  async getLeagueSeasons(leagueId: string): Promise<Season[]> {
    const cached = this.seasonBadgesCache.get(leagueId);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${API_BASE}/search_all_seasons.php?badge=1&id=${leagueId}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json() as { seasons: Season[] };
      const seasons = data.seasons || [];

      this.seasonBadgesCache.set(leagueId, seasons);

      return seasons;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();