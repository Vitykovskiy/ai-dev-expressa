import { vi } from 'vitest';

class ResizeObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  value: ResizeObserverMock,
  writable: true,
});

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  writable: true,
});

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(globalThis, 'CSS', {
  value: {
    supports: () => false,
  },
  writable: true,
});
