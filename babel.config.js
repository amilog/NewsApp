module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@assets': './src/assets',
          '@icons': './src/assets/icons',
          '@constants': './src/constants',
          '@modules': './src/modules',
          '@components': './src/components',
          '@navigation': './src/navigations',
          '@store': './src/store',
          '@services': './src/services',
          '@api': './src/api',
          src: './src',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
