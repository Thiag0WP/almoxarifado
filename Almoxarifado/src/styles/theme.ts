export const theme = {
  colors: {
    primary: '#1976d2',
    primaryDark: '#1565c0',
    secondary: '#2e7d32',
    secondaryDark: '#1b5e20',
    accent: '#f57c00',
    error: '#d32f2f',
    warning: '#f57c00',
    success: '#388e3c',
    background: '#f5f5f5',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#212121',
    textSecondary: '#757575',
    border: '#e0e0e0',
    disabled: '#bdbdbd',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: 'bold' as const,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal' as const,
    },
  },
  shadows: {
    small: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    medium: {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
  },
};

export type Theme = typeof theme;