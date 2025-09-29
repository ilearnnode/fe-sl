import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import App from './App.vue';
import type { League } from './services/api.types';
import { apiService } from './services/api';

vi.mock('./services/api', () => ({
  apiService: {
    getAllLeagues: vi.fn(),
    getLeagueSeasons: vi.fn()
  }
}));

const mockApiService = vi.mocked(apiService);

const mockLeagues: League[] = [
  {
    idLeague: '1',
    strLeague: 'Premier League',
    strSport: 'Soccer',
    strLeagueAlternate: 'EPL'
  },
  {
    idLeague: '2',
    strLeague: 'NBA',
    strSport: 'Basketball',
    strLeagueAlternate: 'National Basketball Association'
  },
  {
    idLeague: '3',
    strLeague: 'La Liga',
    strSport: 'Soccer',
    strLeagueAlternate: 'Spanish League'
  }
];

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiService.getLeagueSeasons.mockResolvedValue([]);
  });

  describe('Loading States', () => {
    it('should show loading spinner initially', async () => {
      mockApiService.getAllLeagues.mockImplementation(() =>
        new Promise(() => { /* never resolves */ })
      );

      const wrapper = mount(App);
      await nextTick();

      expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="league-list"]').exists()).toBe(false);
    });

    it('should hide loading spinner after data loads', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="league-list"]').exists()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API fails', async () => {
      mockApiService.getAllLeagues.mockRejectedValue(new Error('API Error'));

      const wrapper = mount(App);
      await flushPromises();

      expect(wrapper.find('[data-testid="error-message"]').text()).toBe('Failed to load leagues. Please try again.');
      expect(wrapper.find('[data-testid="retry-button"]').text()).toBe('Retry');
    });

    it('should retry fetching when retry button is clicked', async () => {
      mockApiService.getAllLeagues
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      expect(wrapper.find('[data-testid="error-container"]').exists()).toBe(true);

      await wrapper.find('[data-testid="retry-button"]').trigger('click');
      await flushPromises();

      expect(wrapper.find('[data-testid="error-container"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="league-list"]').exists()).toBe(true);
      expect(mockApiService.getAllLeagues).toHaveBeenCalledTimes(2);
    });
  });

  describe('Modal States', () => {
    it('should have modal closed initially', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      const modal = wrapper.findComponent({ name: 'BadgeModal' });
      expect(modal.props('isOpen')).toBe(false);
      expect(modal.props('league')).toBeNull();
    });

    it('should open modal when league is selected', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      const leagueList = wrapper.findComponent({ name: 'LeagueList' });
      await leagueList.vm.$emit('select', mockLeagues[0]);
      await nextTick();

      const modal = wrapper.findComponent({ name: 'BadgeModal' });
      expect(modal.props('isOpen')).toBe(true);
      expect(modal.props('league')).toEqual(mockLeagues[0]);
    });

    it('should close modal when close event is emitted', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      const leagueList = wrapper.findComponent({ name: 'LeagueList' });
      await leagueList.vm.$emit('select', mockLeagues[0]);
      await nextTick();

      const modal = wrapper.findComponent({ name: 'BadgeModal' });
      expect(modal.props('isOpen')).toBe(true);

      await modal.vm.$emit('close');
      await nextTick();

      expect(modal.props('isOpen')).toBe(false);

      await new Promise(resolve => setTimeout(resolve, 350));
      expect(modal.props('league')).toBeNull();
    });
  });

  describe('League Items Rendering', () => {
    it('should render all leagues when loaded', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      const leagueList = wrapper.findComponent({ name: 'LeagueList' });
      expect(leagueList.props('leagues')).toHaveLength(3);
      expect(leagueList.props('leagues')).toEqual(mockLeagues);
    });

    it('should filter leagues by search term', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      const searchBar = wrapper.findComponent({ name: 'SearchBar' });
      await searchBar.vm.$emit('update:modelValue', 'Premier');
      await nextTick();

      const leagueList = wrapper.findComponent({ name: 'LeagueList' });
      expect(leagueList.props('leagues')).toHaveLength(1);
      expect(leagueList.props('leagues')[0].strLeague).toBe('Premier League');
    });

    it('should filter leagues by sport', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      const sportFilter = wrapper.findComponent({ name: 'SportFilter' });
      await sportFilter.vm.$emit('update:modelValue', 'Soccer');
      await nextTick();

      const leagueList = wrapper.findComponent({ name: 'LeagueList' });
      expect(leagueList.props('leagues')).toHaveLength(2);
      expect(leagueList.props('leagues').every((l: League) => l.strSport === 'Soccer')).toBe(true);
    });

    it('should combine search and sport filters', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      const searchBar = wrapper.findComponent({ name: 'SearchBar' });
      await searchBar.vm.$emit('update:modelValue', 'La');

      const sportFilter = wrapper.findComponent({ name: 'SportFilter' });
      await sportFilter.vm.$emit('update:modelValue', 'Soccer');
      await nextTick();

      const leagueList = wrapper.findComponent({ name: 'LeagueList' });
      expect(leagueList.props('leagues')).toHaveLength(1);
      expect(leagueList.props('leagues')[0].strLeague).toBe('La Liga');
    });

    it('should search in alternate league names', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      const searchBar = wrapper.findComponent({ name: 'SearchBar' });
      await searchBar.vm.$emit('update:modelValue', 'EPL');
      await nextTick();

      const leagueList = wrapper.findComponent({ name: 'LeagueList' });
      expect(leagueList.props('leagues')).toHaveLength(1);
      expect(leagueList.props('leagues')[0].strLeague).toBe('Premier League');
    });

    it('should display unique sports in filter', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      const sportFilter = wrapper.findComponent({ name: 'SportFilter' });
      expect(sportFilter.props('sports')).toEqual(['Basketball', 'Soccer']);
    });

    it('should show empty state when no leagues match filters', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      const searchBar = wrapper.findComponent({ name: 'SearchBar' });
      await searchBar.vm.$emit('update:modelValue', 'NonExistentLeague');
      await nextTick();

      const leagueList = wrapper.findComponent({ name: 'LeagueList' });
      expect(leagueList.props('leagues')).toHaveLength(0);
    });
  });

  describe('Component Integration', () => {
    it('should render all child components', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      const wrapper = mount(App);
      await flushPromises();

      expect(wrapper.find('[data-testid="search-bar"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="sport-filter"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="league-list"]').exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'BadgeModal' }).exists()).toBe(true);
    });

    it('should call API service on mount', async () => {
      mockApiService.getAllLeagues.mockResolvedValue(mockLeagues);

      mount(App);
      await flushPromises();

      expect(mockApiService.getAllLeagues).toHaveBeenCalledTimes(1);
    });
  });
});