import { mount } from '@vue/test-utils';
import MenuStickyActionDock from '../MenuStickyActionDock.vue';
import MenuCatalogToastHost from '../MenuCatalogToastHost.vue';
import MenuActionButton from './MenuActionButton.vue';
import MenuListRow from './MenuListRow.vue';

const MenuSurfaceCardStub = {
  name: 'MenuSurfaceCard',
  props: ['variant'],
  template: '<section class="menu-surface-card" :data-variant="variant"><slot /></section>',
};

const MenuBadgeStub = {
  name: 'MenuBadge',
  props: ['tone'],
  template: '<span class="menu-badge" :data-tone="tone"><slot /></span>',
};

const MenuActionButtonStub = {
  name: 'MenuActionButton',
  emits: ['click'],
  template: '<button class="menu-action-button" v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
};

const VBtnStub = {
  name: 'VBtn',
  template: '<button class="v-btn" v-bind="$attrs"><span class="v-btn__content"><slot /></span></button>',
};

describe('menu UI primitives', () => {
  it('keeps action button visual state classes and forwards attrs to the Vuetify button', () => {
    const wrapper = mount(MenuActionButton, {
      props: {
        block: true,
        size: 'compact',
        variant: 'danger',
      },
      attrs: {
        disabled: true,
        type: 'submit',
      },
      slots: {
        default: 'РЈРґР°Р»РёС‚СЊ РёР· С‡РµСЂРЅРѕРІРёРєР°',
      },
      global: {
        stubs: {
          VBtn: VBtnStub,
        },
      },
    });

    expect(wrapper.classes()).toContain('menu-action-button--danger');
    expect(wrapper.classes()).toContain('menu-action-button--compact');
    expect(wrapper.classes()).toContain('menu-action-button--block');
    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
    expect(wrapper.get('button').attributes('type')).toBe('submit');
  });

  it('marks selected interactive rows without losing the requested semantic tag', () => {
    const wrapper = mount(MenuListRow, {
      props: {
        interactive: true,
        selected: true,
        tag: 'button',
        tone: 'accent',
      },
      attrs: {
        type: 'button',
      },
      slots: {
        default: '<strong>Р”Р»РёРЅРЅРѕРµ РЅР°Р·РІР°РЅРёРµ РїРѕР·РёС†РёРё</strong>',
        meta: 'РќР°РїРёС‚РѕРє В· S 190 В· M 230 В· L 270',
        trailing: '<span>РћС‚РєСЂС‹С‚СЊ</span>',
      },
    });

    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'menu-list-row--accent',
        'menu-list-row--interactive',
        'menu-list-row--selected',
      ]),
    );
    expect(wrapper.get('.menu-list-row__trailing').text()).toBe('РћС‚РєСЂС‹С‚СЊ');
  });

  it('separates content and actions in sticky docks and marks contentless action areas', () => {
    const withContent = mount(MenuStickyActionDock, {
      props: {
        placement: 'top',
        variant: 'warning',
      },
      slots: {
        content: '<p>Р•СЃС‚СЊ РЅРµСЃРѕС…СЂР°РЅРµРЅРЅС‹Р№ С‡РµСЂРЅРѕРІРёРє</p>',
        actions: '<button>РЎРѕС…СЂР°РЅРёС‚СЊ</button>',
      },
      global: {
        stubs: {
          MenuSurfaceCard: MenuSurfaceCardStub,
        },
      },
    });

    expect(withContent.classes()).toContain('menu-sticky-dock--top');
    expect(withContent.classes()).not.toContain('menu-sticky-dock--contentless');
    expect(withContent.get('.menu-surface-card').attributes('data-variant')).toBe('warning');
    expect(withContent.find('.menu-sticky-dock__content').exists()).toBe(true);

    const contentless = mount(MenuStickyActionDock, {
      slots: {
        actions: '<button>РћС‚РјРµРЅР°</button>',
      },
      global: {
        stubs: {
          MenuSurfaceCard: MenuSurfaceCardStub,
        },
      },
    });

    expect(contentless.classes()).toContain('menu-sticky-dock--bottom');
    expect(contentless.classes()).toContain('menu-sticky-dock--contentless');
    expect(contentless.find('.menu-sticky-dock__content').exists()).toBe(false);
  });
});

describe('MenuCatalogToastHost', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders warning feedback above persistent actions and closes it on timer', async () => {
    const wrapper = mount(MenuCatalogToastHost, {
      props: {
        toast: {
          id: 7,
          text: 'РџСЂРѕРІРµСЂСЊС‚Рµ СЃРѕСЃС‚РѕСЏРЅРёРµ С‡РµСЂРЅРѕРІРёРєР° РїРµСЂРµРґ РїРµСЂРµС…РѕРґРѕРј.',
          title: 'РџСЂРµРґСѓРїСЂРµР¶РґРµРЅРёРµ',
          tone: 'warning',
        },
      },
      global: {
        stubs: {
          MenuActionButton: MenuActionButtonStub,
          MenuBadge: MenuBadgeStub,
          MenuSurfaceCard: MenuSurfaceCardStub,
        },
      },
    });

    expect(wrapper.get('.menu-toast-host').attributes('aria-live')).toBe('polite');
    expect(wrapper.get('.menu-surface-card').attributes('data-variant')).toBe('warning');
    expect(wrapper.text()).toContain('РџСЂРµРґСѓРїСЂРµР¶РґРµРЅРёРµ');

    await vi.advanceTimersByTimeAsync(4000);

    expect(wrapper.emitted('close')).toHaveLength(1);
  });
});
