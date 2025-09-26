import type { League, Season, ApiResponse } from '../types/league';

const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ApiService {
  private cache = new Map<string, ApiResponse<any>>();

  private async fetchWithCache<T>(url: string): Promise<T> {
    const cached = this.cache.get(url);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      this.cache.set(url, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  async getAllLeagues(): Promise<League[]> {
    const url = `${API_BASE}/all_leagues.php`;
    const response = await this.fetchWithCache<{ leagues: League[] }>(url);
    return response.leagues || [];
  }

  async getSeasonBadge(leagueId: string): Promise<Season[]> {
    const url = `${API_BASE}/search_all_seasons.php?badge=1&id=${leagueId}`;
    const response = await this.fetchWithCache<{ seasons: Season[] }>(url);
    return response.seasons || [];
  }
}

export const apiService = new ApiService();