import { Platform } from 'react-native';

const theme = {
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    primary: '#0366d6',
    appBarBackground: '#24292e',
    appBackground: '#e1e4e8',
    white: '#ffffff',
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: Platform.select({
      ios: 'Arial',
      android: 'Roboto',
      default: 'System',
    }),
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
  spacing: {
    small: 4,
    medium: 8,
    large: 16,
  },
  roundness: {
    small: 4,
    medium: 8,
    large: 16,
  },
  image: {
    avatar: 48,
  },
};

export default theme;