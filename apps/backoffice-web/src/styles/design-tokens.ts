const colors = {
  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#F5F5F7',
  backgroundSurface: '#FFFFFF',
  backgroundSurfaceRaised: '#F5F5F7',
  textPrimary: '#111111',
  textSecondary: '#555555',
  textMuted: '#999999',
  textOnAccent: '#FFFFFF',
  accent: '#1A1AFF',
  accentLight: '#E8E8FF',
  destructive: '#D32F2F',
  destructiveLight: '#FFEBEE',
  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#E65100',
  warningLight: '#FFF3E0',
  neutral: '#757575',
  neutralLight: '#F5F5F5',
  border: '#E0E0E0',
  borderStrong: '#BDBDBD',
  overlay: 'rgba(0, 0, 0, 0.4)',
} as const;

const typography = {
  fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif",
  monoFontFamily: "'Consolas', 'SFMono-Regular', monospace",
  scale: {
    h1: { size: '24px', weight: '700', lineHeight: '1.2' },
    h2: { size: '18px', weight: '600', lineHeight: '1.3' },
    h3: { size: '15px', weight: '600', lineHeight: '1.4' },
    body: { size: '14px', weight: '400', lineHeight: '1.5' },
    caption: { size: '12px', weight: '400', lineHeight: '1.4' },
    label: { size: '13px', weight: '500', lineHeight: '1' },
    mono: { size: '13px', weight: '500', lineHeight: '1.4' },
  },
} as const;

const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const;

const borderRadius = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  pill: '999px',
} as const;

const shadows = {
  card: '0 1px 4px rgba(0, 0, 0, 0.08)',
  modal: '0 8px 32px rgba(0, 0, 0, 0.16)',
  tabBar: '0 -1px 0 #E0E0E0',
} as const;

const animation = {
  durationFast: '120ms',
  durationDefault: '200ms',
  easing: 'ease-in-out',
} as const;

export const expressaDesignTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  accessibility: {
    minTouchTarget: '44px',
    focusRing: `0 0 0 3px ${colors.accentLight}`,
  },
  legacyAccents: {
    orders: `linear-gradient(90deg, ${colors.accent}, ${colors.accentLight})`,
    availability: `linear-gradient(90deg, ${colors.success}, ${colors.successLight})`,
    menu: `linear-gradient(90deg, ${colors.warning}, ${colors.warningLight})`,
    users: `linear-gradient(90deg, ${colors.neutral}, ${colors.neutralLight})`,
    settings: `linear-gradient(90deg, ${colors.borderStrong}, ${colors.accentLight})`,
  },
} as const;

function buildCssVariables() {
  const tokenVars: Record<string, string> = {
    '--expressa-color-background-primary': colors.backgroundPrimary,
    '--expressa-color-background-secondary': colors.backgroundSecondary,
    '--expressa-color-background-surface': colors.backgroundSurface,
    '--expressa-color-background-surface-raised': colors.backgroundSurfaceRaised,
    '--expressa-color-text-primary': colors.textPrimary,
    '--expressa-color-text-secondary': colors.textSecondary,
    '--expressa-color-text-muted': colors.textMuted,
    '--expressa-color-text-on-accent': colors.textOnAccent,
    '--expressa-color-accent': colors.accent,
    '--expressa-color-accent-light': colors.accentLight,
    '--expressa-color-destructive': colors.destructive,
    '--expressa-color-destructive-light': colors.destructiveLight,
    '--expressa-color-success': colors.success,
    '--expressa-color-success-light': colors.successLight,
    '--expressa-color-warning': colors.warning,
    '--expressa-color-warning-light': colors.warningLight,
    '--expressa-color-neutral': colors.neutral,
    '--expressa-color-neutral-light': colors.neutralLight,
    '--expressa-color-border': colors.border,
    '--expressa-color-border-strong': colors.borderStrong,
    '--expressa-color-overlay': colors.overlay,
    '--expressa-font-family-base': typography.fontFamily,
    '--expressa-font-family-mono': typography.monoFontFamily,
    '--expressa-font-size-h1': typography.scale.h1.size,
    '--expressa-font-size-h2': typography.scale.h2.size,
    '--expressa-font-size-h3': typography.scale.h3.size,
    '--expressa-font-size-body': typography.scale.body.size,
    '--expressa-font-size-caption': typography.scale.caption.size,
    '--expressa-font-size-label': typography.scale.label.size,
    '--expressa-font-size-mono': typography.scale.mono.size,
    '--expressa-font-weight-h1': typography.scale.h1.weight,
    '--expressa-font-weight-h2': typography.scale.h2.weight,
    '--expressa-font-weight-h3': typography.scale.h3.weight,
    '--expressa-font-weight-body': typography.scale.body.weight,
    '--expressa-font-weight-caption': typography.scale.caption.weight,
    '--expressa-font-weight-label': typography.scale.label.weight,
    '--expressa-font-weight-mono': typography.scale.mono.weight,
    '--expressa-line-height-h1': typography.scale.h1.lineHeight,
    '--expressa-line-height-h2': typography.scale.h2.lineHeight,
    '--expressa-line-height-h3': typography.scale.h3.lineHeight,
    '--expressa-line-height-body': typography.scale.body.lineHeight,
    '--expressa-line-height-caption': typography.scale.caption.lineHeight,
    '--expressa-line-height-label': typography.scale.label.lineHeight,
    '--expressa-line-height-mono': typography.scale.mono.lineHeight,
    '--expressa-spacing-xs': spacing.xs,
    '--expressa-spacing-sm': spacing.sm,
    '--expressa-spacing-md': spacing.md,
    '--expressa-spacing-lg': spacing.lg,
    '--expressa-spacing-xl': spacing.xl,
    '--expressa-radius-sm': borderRadius.sm,
    '--expressa-radius-md': borderRadius.md,
    '--expressa-radius-lg': borderRadius.lg,
    '--expressa-radius-pill': borderRadius.pill,
    '--expressa-shadow-card': shadows.card,
    '--expressa-shadow-modal': shadows.modal,
    '--expressa-shadow-tab-bar': shadows.tabBar,
    '--expressa-duration-fast': animation.durationFast,
    '--expressa-duration-default': animation.durationDefault,
    '--expressa-easing': animation.easing,
    '--expressa-min-touch-target': expressaDesignTokens.accessibility.minTouchTarget,
    '--expressa-focus-ring': expressaDesignTokens.accessibility.focusRing,
    '--expressa-accent-orders': expressaDesignTokens.legacyAccents.orders,
    '--expressa-accent-availability': expressaDesignTokens.legacyAccents.availability,
    '--expressa-accent-menu': expressaDesignTokens.legacyAccents.menu,
    '--expressa-accent-users': expressaDesignTokens.legacyAccents.users,
    '--expressa-accent-settings': expressaDesignTokens.legacyAccents.settings,
    '--expressa-background': colors.backgroundSecondary,
    '--expressa-surface': colors.backgroundSurface,
    '--expressa-text': colors.textPrimary,
    '--expressa-secondary': colors.textSecondary,
    '--expressa-muted': colors.textMuted,
    '--expressa-border': colors.border,
  };

  return tokenVars;
}

export const expressaCssVariables = buildCssVariables();

export function installExpressaDesignTokens(target: HTMLElement = document.documentElement) {
  Object.entries(expressaCssVariables).forEach(([name, value]) => {
    target.style.setProperty(name, value);
  });
}
