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
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
