import { Platform } from 'react-native';

export const theme = {
  spacing: {
    small: 8,
    medium: 16,
    large: 24,

  },
  borderRadius: {
    default: 50,

  },
  colours: {
    error: '#FF0000',
    warning: '#FFA500',
    success: '#008000',

  },
  light: {
    text: '#000000',
    background: '#afdbff',
    navBackground: '#f4faff',
    btnBackground: '#58d5ff',

  },
  dark: {
    text: '#FFFFFF',
    background: '#002b4e',
    navBackground: '#001a33',
    btnBackground: '#0a7ea4',

  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
