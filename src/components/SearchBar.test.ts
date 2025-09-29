import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchBar from './SearchBar.vue';

describe('SearchBar', () => {
  it('displays the provided value', () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: 'Premier League' }
    });

    const input = wrapper.find('input');
    expect(input.element.value).toBe('Premier League');
  });

  it('emits update:modelValue event when typing', async () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: '' }
    });

    const input = wrapper.find('input');
    await input.setValue('NBA');

    expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual(['NBA']);
  });
});