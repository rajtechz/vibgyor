const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    ...defaultConfig.resolver,
    // Enable New Architecture support
    unstable_enablePackageExports: false,
    sourceExts: [...(defaultConfig.resolver?.sourceExts || []), 'ts', 'tsx', 'mjs', 'cjs'],
    assetExts: (defaultConfig.resolver?.assetExts || []).filter(ext => ext !== 'svg'),
    resolverMainFields: ['react-native', 'browser', 'main'],
    platforms: ['ios', 'android', 'native', 'web'],
  },
  watchFolders: [path.resolve(__dirname)],
  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(defaultConfig, config);
