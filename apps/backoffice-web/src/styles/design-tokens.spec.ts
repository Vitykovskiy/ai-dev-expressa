import { describe, expect, it } from 'vitest';
import {
  expressaCssVariables,
  expressaDesignTokens,
  installExpressaDesignTokens,
} from './design-tokens';

describe('design tokens', () => {
  it('keeps the contract values in exported tokens', () => {
    expect(expressaDesignTokens.colors.accent).toBe('#1A1AFF');
    expect(expressaDesignTokens.colors.destructive).toBe('#D32F2F');
    expect(expressaDesignTokens.spacing.md).toBe('16px');
    expect(expressaDesignTokens.borderRadius.md).toBe('10px');
    expect(expressaDesignTokens.typography.scale.h2.size).toBe('18px');
  });

  it('installs semantic and legacy CSS variables on the target element', () => {
    const target = document.createElement('div');

    installExpressaDesignTokens(target);

    expect(target.style.getPropertyValue('--expressa-color-accent')).toBe(
      expressaDesignTokens.colors.accent,
    );
    expect(target.style.getPropertyValue('--expressa-background')).toBe(
      expressaDesignTokens.colors.backgroundSecondary,
    );
    expect(target.style.getPropertyValue('--expressa-accent-orders')).toBe(
      expressaDesignTokens.legacyAccents.orders,
    );
    expect(expressaCssVariables['--expressa-shadow-card']).toBe(expressaDesignTokens.shadows.card);
  });
});
