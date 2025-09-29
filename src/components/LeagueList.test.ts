import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LeagueList from './LeagueList.vue';
import LeagueItem from './LeagueItem.vue';
import type { League } from '../services/api.types';

describe('LeagueList', () => {
  const leagues: League[] = [
    {
      idLeague: '1',
      strLeague: 'Premier League',
      strSport: 'Soccer',
      strLeagueAlternate: ''
    },
    {
      idLeague: '2',
      strLeague: 'NBA',
      strSport: 'Basketball',
      strLeagueAlternate: ''
    }
  ];

  it('displays the provided leagues', () => {
    const wrapper = mount(LeagueList, {
      props: { leagues }
    });

    const leagueItems = wrapper.findAllComponents(LeagueItem);
    expect(leagueItems).toHaveLength(2);

    // Check first league
    expect(leagueItems[0]?.find('[data-testid="league-name"]').text()).toBe('Premier League');
    expect(leagueItems[0]?.find('[data-testid="league-sport"]').text()).toBe('Soccer');

    // Check second league
    expect(leagueItems[1]?.find('[data-testid="league-name"]').text()).toBe('NBA');
    expect(leagueItems[1]?.find('[data-testid="league-sport"]').text()).toBe('Basketball');
  });

  it('emits select event when a league is clicked', async () => {
    const wrapper = mount(LeagueList, {
      props: { leagues }
    });

    const leagueItems = wrapper.findAllComponents(LeagueItem);
    await leagueItems[0]?.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('select');
    expect(wrapper.emitted()['select']?.[0]).toEqual([leagues[0]]);
  });

  it('displays empty message when no leagues provided', () => {
    const wrapper = mount(LeagueList, {
      props: { leagues: [] }
    });

    const noLeaguesMessage = wrapper.find('[data-testid="no-leagues-message"]');
    expect(noLeaguesMessage.text()).toBe('No leagues found');
  });
});