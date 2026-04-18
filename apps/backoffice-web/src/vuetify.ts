import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { expressaDesignTokens } from './styles/design-tokens';

const { colors, borderRadius, shadows, typography } = expressaDesignTokens;

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'expressa',
    themes: {
      expressa: {
        dark: false,
        colors: {
          background: colors.backgroundSecondary,
          surface: colors.backgroundSurface,
          'surface-bright': colors.backgroundSurfaceRaised,
          primary: colors.accent,
          secondary: colors.textSecondary,
          info: colors.accent,
          success: colors.success,
          warning: colors.warning,
          error: colors.destructive,
          'accent-light': colors.accentLight,
          'success-light': colors.successLight,
          'warning-light': colors.warningLight,
          'destructive-light': colors.destructiveLight,
          'neutral-light': colors.neutralLight,
          'text-primary': colors.textPrimary,
          'text-secondary': colors.textSecondary,
          'text-muted': colors.textMuted,
          border: colors.border,
          'border-strong': colors.borderStrong,
          overlay: colors.overlay,
        },
      },
    },
  },
  defaults: {
    VCard: {
      rounded: borderRadius.lg,
      elevation: 0,
      style: [
        { border: `1px solid ${colors.border}` },
        { boxShadow: shadows.card },
      ],
    },
    VBtn: {
      rounded: borderRadius.md,
      minHeight: 44,
      style: [
        { fontSize: typography.scale.label.size },
        { fontWeight: typography.scale.label.weight },
        { lineHeight: typography.scale.label.lineHeight },
        { letterSpacing: '0' },
        { textTransform: 'none' },
      ],
    },
    VChip: {
      rounded: borderRadius.pill,
      style: [
        { fontSize: typography.scale.caption.size },
        { fontWeight: typography.scale.caption.weight },
        { lineHeight: typography.scale.caption.lineHeight },
      ],
    },
    VTextField: {
      color: 'primary',
      baseColor: 'border-strong',
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
      rounded: borderRadius.md,
    },
    VTextarea: {
      color: 'primary',
      baseColor: 'border-strong',
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
      rounded: borderRadius.md,
    },
    VSelect: {
      color: 'primary',
      baseColor: 'border-strong',
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
      rounded: borderRadius.md,
    },
    VDialog: {
      contentClass: 'expressa-dialog',
    },
    VBottomNavigation: {
      bgColor: 'surface',
      elevation: 0,
    },
  },
});
