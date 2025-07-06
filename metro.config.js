const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

const {
  resolver: { sourceExts, assetExts },
} = config;

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...sourceExts, 'svg'],
  alias: {
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@icons': path.resolve(__dirname, 'src/assets/icons'),
    '@constants': path.resolve(__dirname, 'src/constants'),
    '@modules': path.resolve(__dirname, 'src/modules'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@navigation': path.resolve(__dirname, 'src/navigations'),
    '@services': path.resolve(__dirname, 'src/services'),
    '@store': path.resolve(__dirname, 'src/store'),
    '@api': path.resolve(__dirname, 'src/api'),
    src: path.resolve(__dirname, 'src'),
  },
};

module.exports = config;
