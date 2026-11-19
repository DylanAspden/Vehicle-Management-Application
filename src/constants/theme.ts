import { Platform, StyleSheet } from 'react-native';

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
    shadow: '#000000',
    backdrop: 'rgba(0, 0, 0, 0.45)',
    transparent: 'transparent',
  },
  light: {
    text: '#000000',
    background: '#afdbff',
    navBackground: '#f4faff',
    btnBackground: '#58d5ff',
    tabActive: '#083461',
    tabInactive: '#8E9EAB',
    tabHighlight: '#b4e7ff',
    glassyBackground: 'rgba(244, 250, 255, 0.92)',
    glassyBorder: 'rgba(8, 52, 97, 0.15)',
    glassyCardBackground: 'rgba(255, 255, 255, 0.88)',
    glassyCardBorder: 'rgba(255, 255, 255, 0.7)',
  },
  dark: {
    text: '#FFFFFF',
    background: '#002b4e',
    navBackground: '#001a33',
    btnBackground: '#0a7ea4',
    tabActive: '#FFFFFF',
    tabInactive: '#8E9EAB',
    tabHighlight: '#0a7ea4',
    glassyBackground: 'rgba(0, 26, 51, 0.88)',
    glassyBorder: 'rgba(180, 231, 255, 0.25)',
    glassyCardBackground: 'rgba(15, 32, 55, 0.85)',
    glassyCardBorder: 'rgba(180, 231, 255, 0.22)',
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

export const ui = {
  layout: StyleSheet.create({
    screenCenter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.large,
    },
    headerWrapper: {
      paddingHorizontal: theme.spacing.medium,
      paddingBottom: theme.spacing.small,
      alignItems: 'center',
    },
  }),

  typography: StyleSheet.create({
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: theme.spacing.small,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 16,
    },
    tabLabel: {
      fontSize: 14,
      marginTop: 2,
      paddingBottom: 2,
    },
  }),

  shadows: StyleSheet.create({
    floatingPill: {
      shadowColor: theme.colours.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
      elevation: 6,
    },
  }),

  navigation: StyleSheet.create({
    pillHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: 900,
      height: 60,
      paddingHorizontal: 6,
      borderRadius: theme.borderRadius.default,
      borderWidth: 1.5,
    },
    tabBar: {
      borderTopWidth: 0,
      elevation: 0,
      height: 75,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 10,
    },
    tabPill: {
      borderRadius: theme.borderRadius.default,
      width: 100,
      height: 52,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
  }),

  controls: StyleSheet.create({
    iconBtn: {
      width: 100,
      height: 50,
      borderRadius: theme.borderRadius.default,
      justifyContent: 'center',
      alignItems: 'center',
    },
    LinkButton: {
      margin: 10,
      fontSize: 16,
      fontWeight: 'bold',
      padding: 15,
      borderRadius: theme.borderRadius.default,
    },
    HeaderButton: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.default,
      justifyContent: "center",
      alignItems: "center",
    },
    HeaderSpacer: {
      width: 48,
      height: 48,
    },
    primaryButton: {
      marginTop: theme.spacing.large,
      minHeight: 48,
      minWidth: 160,
      paddingVertical: 12,
      paddingHorizontal: theme.spacing.large,
      borderRadius: theme.borderRadius.default,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
};