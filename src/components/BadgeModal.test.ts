import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import BadgeModal from './BadgeModal.vue';
import type { League } from '../services/api.types';
import { apiService } from '../services/api';

vi.mock('../services/api', () => ({
  apiService: {
    getLeagueSeasons: vi.fn()
  }
}));

describe('BadgeModal', () => {
  const mockLeague: League = {
    idLeague: '4328',
    strLeague: 'English Premier League',
    strSport: 'Soccer',
    strLeagueAlternate: 'Premier League'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays league name in modal header when open', () => {
    const wrapper = mount(BadgeModal, {
      props: {
        isOpen: true,
        league: mockLeague
      },
      global: {
        stubs: {
          teleport: true
        }
      }
    });

    const modalTitle = wrapper.find('[data-testid="modal-title"]');
    expect(modalTitle.text()).toContain('English Premier League - Season Badges');
  });

  it('emits close event when clicking close button', async () => {
    const wrapper = mount(BadgeModal, {
      props: {
        isOpen: true,
        league: mockLeague
      },
      global: {
        stubs: {
          teleport: true
        }
      }
    });

    const closeButton = wrapper.find('[data-testid="close-modal-button"]');
    await closeButton.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('close');
  });

  it('emits close event when clicking outside the modal', async () => {
    const wrapper = mount(BadgeModal, {
      props: {
        isOpen: true,
        league: mockLeague
      },
      global: {
        stubs: {
          teleport: true
        }
      }
    });

    const overlay = wrapper.find('[data-testid="modal-backdrop"]');
    await overlay.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('close');
  });

  it('shows loading state while fetching season badges', async () => {
    vi.mocked(apiService.getLeagueSeasons).mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading state
    );

    const wrapper = mount(BadgeModal, {
      props: {
        isOpen: false,
        league: mockLeague
      },
      global: {
        stubs: {
          teleport: true
        }
      }
    });

    // Open the modal to trigger API call
    await wrapper.setProps({ isOpen: true });
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(true);
  });

  it('displays error state when API call fails', async () => {
    vi.mocked(apiService.getLeagueSeasons).mockRejectedValue(new Error('API Error'));

    const wrapper = mount(BadgeModal, {
      props: {
        isOpen: false,
        league: mockLeague
      },
      global: {
        stubs: {
          teleport: true
        }
      }
    });

    await wrapper.setProps({ isOpen: true });
    await flushPromises();

    const errorMessage = wrapper.find('[data-testid="error-message"]');
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toBe('Failed to load season badges');
  });

  it('displays "No season badge available" when no badges found', async () => {
    vi.mocked(apiService.getLeagueSeasons).mockResolvedValue([
      { strSeason: '2023-2024', strBadge: '' },
      { strSeason: '2022-2023', strBadge: null as any }
    ]);

    const wrapper = mount(BadgeModal, {
      props: {
        isOpen: false,
        league: mockLeague
      },
      global: {
        stubs: {
          teleport: true
        }
      }
    });

    await wrapper.setProps({ isOpen: true });
    await flushPromises();

    const noBadgeMessage = wrapper.find('[data-testid="no-badge-message"]');
    expect(noBadgeMessage.exists()).toBe(true);
    expect(noBadgeMessage.text()).toBe('No season badge available');
  });

  it('displays latest season badge when available', async () => {
    vi.mocked(apiService.getLeagueSeasons).mockResolvedValue([
      { strSeason: '2021-2022', strBadge: 'https://example.com/badge1.png' },
      { strSeason: '2022-2023', strBadge: '' },
      { strSeason: '2023-2024', strBadge: 'https://example.com/badge2.png' }
    ]);

    const wrapper = mount(BadgeModal, {
      props: {
        isOpen: false,
        league: mockLeague
      },
      global: {
        stubs: {
          teleport: true
        }
      }
    });

    await wrapper.setProps({ isOpen: true });
    await flushPromises();

    const img = wrapper.find('[data-testid="season-badge-image"]');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('https://example.com/badge2.png');

    const seasonText = wrapper.find('[data-testid="season-text"]');
    expect(seasonText.exists()).toBe(true);
    expect(seasonText.text()).toBe('2023-2024');
  });
});