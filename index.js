/**
 * @format
 */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
if (__DEV__) {
  require('./ReactotronConfig');
}
import { AppRegistry } from 'react-native';
import App from './app/pages/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
