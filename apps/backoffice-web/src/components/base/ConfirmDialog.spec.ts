import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ConfirmDialog from './ConfirmDialog.vue';
import { vuetify } from '../../vuetify';

describe('ConfirmDialog', () => {
  it('renders the dialog content and the optional input', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        title: 'Delete item',
        description: 'This action cannot be undone.',
        requireInput: true,
        inputPlaceholder: 'Type DELETE to confirm',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.find('[data-testid="confirm-dialog"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Delete item');
    expect(wrapper.text()).toContain('This action cannot be undone.');
    expect(wrapper.get('input').attributes('placeholder')).toBe('Type DELETE to confirm');
  });

  it('emits confirm with the input value and closes the dialog', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        title: 'Archive item',
        requireInput: true,
        confirmVariant: 'destructive',
      },
      global: {
        plugins: [vuetify],
      },
    });

    await wrapper.get('input').setValue('archive-123');
    await wrapper.get('[data-testid="confirm-dialog-confirm"]').trigger('click');
    await nextTick();

    expect(wrapper.emitted('confirm')).toEqual([['archive-123']]);
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('emits cancel when the action is dismissed', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        title: 'Close dialog',
      },
      global: {
        plugins: [vuetify],
      },
    });

    await wrapper.get('[data-testid="confirm-dialog-cancel"]').trigger('click');

    expect(wrapper.emitted('cancel')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });
});
