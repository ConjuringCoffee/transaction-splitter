const IS_PREVIEW_VARIANT = process.env.APP_VARIANT === 'preview';

export default {
  'name': IS_PREVIEW_VARIANT ? 'Transaction Splitter (Preview)' : 'Transaction Splitter',
  'slug': 'transaction-splitter',
  'version': '1.0.0',
  'orientation': 'portrait',
  'icon': './assets/icon.png',
  'userInterfaceStyle': 'automatic',
  'splash': {
    'image': './assets/splash.png',
    'resizeMode': 'contain',
    'backgroundColor': '#ffffff',
  },
  'updates': {
    'fallbackToCacheTimeout': 0,
    'url': 'https://u.expo.dev/a696a7fc-1c64-400a-a279-c33ccdbce5db',
  },
  'assetBundlePatterns': [
    '**/*',
  ],
  'ios': {
    'supportsTablet': true,
    'splash': {
      'image': './assets/splash.png',
      'backgroundColor': '#FFFFFF',
      'dark': {
        'image': './assets/splash.png',
        'backgroundColor': '#000000',
      },
    },
  },
  'androidStatusBar': {
    'translucent': true,
  },
  'android': {
    'adaptiveIcon': {
      'foregroundImage': './assets/adaptive-icon.png',
      'backgroundColor': '#5C9CA4',
    },
    'package': IS_PREVIEW_VARIANT ? 'com.conjuringcoffee.transactionsplitter.preview' : 'com.conjuringcoffee.transactionsplitter',
    'splash': {
      'image': './assets/splash.png',
      'backgroundColor': '#FFFFFF',
      'dark': {
        'image': './assets/splash.png',
        'backgroundColor': '#000000',
      },
    },
  },
  'web': {
    'favicon': './assets/favicon.png',
  },
  'extra': {
    'eas': {
      'projectId': 'a696a7fc-1c64-400a-a279-c33ccdbce5db',
    },
  },
  'runtimeVersion': {
    'policy': 'sdkVersion',
  },
  'plugins': [
    'expo-localization',
  ],
};
