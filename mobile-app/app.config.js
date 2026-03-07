export default {
  name: 'tribal-accessibility-app',
  slug: 'tribal-accessibility-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.tribal.accessibility'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF'
    },
    package: 'com.tribal.accessibility'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    apiUrl: process.env.API_GATEWAY_URL || 'http://localhost:3002'
  }
};
