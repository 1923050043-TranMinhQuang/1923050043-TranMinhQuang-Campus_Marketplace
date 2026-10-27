import { tokens, type ThemeTokens } from '@/constants/tokens';
import { useColorScheme } from '@/components/useColorScheme';

export function useThemeTokens(): ThemeTokens {
  const scheme = useColorScheme();
  return tokens[scheme === 'dark' ? 'dark' : 'light'];
}
