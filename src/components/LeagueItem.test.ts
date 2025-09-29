import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LeagueItem from './LeagueItem.vue';
import type { League } from '../services/api.types';

describe('LeagueItem', () => {
  it('displays the provided league information', () => {
    const league: League = {
      idLeague: '4328',
      strLeague: 'English Premier League',
      strSport: 'Soccer',
      strLeagueAlternate: 'Premier League'
    };

    const wrapper = mount(LeagueItem, {
      props: { league }
    });

    expect(wrapper.find('[data-testid="league-name"]').text()).toBe('English Premier League');
    expect(wrapper.find('[data-testid="league-sport"]').text()).toBe('Soccer');
    expect(wrapper.find('[data-testid="league-alternate"]').text()).toBe('Premier League');
  });
});