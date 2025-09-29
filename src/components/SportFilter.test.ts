import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SportFilter from './SportFilter.vue';

describe('SportFilter', () => {
  it('displays the provided sports', () => {
    const sports = ['Soccer', 'Basketball', 'Baseball'];
    const wrapper = mount(SportFilter, {
      props: { modelValue: 'Soccer', sports }
    });

    const options = wrapper.findAll('option');
    expect(options.length).toBe(4);
    expect(options[0]?.text()).toBe('All Sports');
    expect(options[1]?.text()).toBe('Soccer');
    expect(options[2]?.text()).toBe('Basketball');
    expect(options[3]?.text()).toBe('Baseball');
  });

  it('emits update:modelValue event when selection changes', async () => {
    const sports = ['Soccer', 'Basketball', 'Baseball'];
    const wrapper = mount(SportFilter, {
      props: { modelValue: '', sports }
    });

    const select = wrapper.find('select');
    await select.setValue('Basketball');

    expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual(['Basketball']);
  });
});
