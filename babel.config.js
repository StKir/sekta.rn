module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./app'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          apptests: './apptests',
          appData: './appData',
          '@': './app',
          '@/app': './app',
          '@/entities': './app/entities',
          '@/shared': './app/shared',
          '@/features': './app/features',
          '@/widgets': './app/widgets',
          '@/pages': './app/pages',
        },
      },
    ],
  ],
};
