const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable support for reanimated
config.resolver.alias = {
  ...config.resolver.alias,
  '@': './src',
};

module.exports = config;