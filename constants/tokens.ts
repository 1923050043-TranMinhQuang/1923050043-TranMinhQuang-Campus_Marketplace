/**
 * Single source of colour tokens. No hex colours elsewhere in the app.
 * Contrast: body text vs background meets WCAG AA 4.5:1 in both schemes.
 */
export const tokens = {
  light: {
    background: '#F7F4EF',
    surface: '#FFFFFF',
    surfaceMuted: '#EFEAE3',
    text: '#1A1A1A',
    textSecondary: '#5C5C5C',
    border: '#D6CFC4',
    tint: '#0B6E4F',
    tintMuted: '#D8EDE4',
    danger: '#B42318',
    dangerMuted: '#FEE4E2',
    warning: '#B54708',
    warningMuted: '#FEF0C7',
    success: '#027A48',
    offline: '#B54708',
    offlineBanner: '#FEF0C7',
    tabIconDefault: '#8A847A',
    tabIconSelected: '#0B6E4F',
    overlay: 'rgba(26, 26, 26, 0.45)',
    inputBackground: '#FFFFFF',
    placeholder: '#8A847A',
    onTint: '#FFFFFF',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceMuted: '#2A2A2A',
    text: '#F2F2F2',
    textSecondary: '#B0B0B0',
    border: '#3A3A3A',
    tint: '#3DDC97',
    tintMuted: '#1A3D30',
    danger: '#F97066',
    dangerMuted: '#3B1614',
    warning: '#FDB022',
    warningMuted: '#3D2E12',
    success: '#32D583',
    offline: '#FDB022',
    offlineBanner: '#3D2E12',
    tabIconDefault: '#8A8A8A',
    tabIconSelected: '#3DDC97',
    overlay: 'rgba(0, 0, 0, 0.55)',
    inputBackground: '#2A2A2A',
    placeholder: '#8A8A8A',
    onTint: '#121212',
  },
} as const;

export type ColorSchemeName = keyof typeof tokens;
export type ThemeTokens = (typeof tokens)[ColorSchemeName];

/** @deprecated Use tokens via useThemeTokens — kept only if a path still imports Colors */
export default {
  light: {
    text: tokens.light.text,
    background: tokens.light.background,
    tint: tokens.light.tint,
    tabIconDefault: tokens.light.tabIconDefault,
    tabIconSelected: tokens.light.tabIconSelected,
  },
  dark: {
    text: tokens.dark.text,
    background: tokens.dark.background,
    tint: tokens.dark.tint,
    tabIconDefault: tokens.dark.tabIconDefault,
    tabIconSelected: tokens.dark.tabIconSelected,
  },
};
