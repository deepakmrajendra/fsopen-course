import 'dotenv/config';

export default {
  "name": "rate-repository-app",
  "slug": "rate-repository-app",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/icon.png",
  "userInterfaceStyle": "light",
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "assetBundlePatterns": [
    "**/*"
  ],
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "com.anonymous.raterepositoryapp"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#ffffff"  
    },
    "package": "com.anonymous.raterepositoryapp"
  },
  "web": {
    "favicon": "./assets/favicon.png"
  },
  "extra": {
    "env": process.env.ENV,
    "APOLLO_URI": process.env.APOLLO_URI
  },
};
