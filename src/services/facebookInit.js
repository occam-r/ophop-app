import { Settings } from 'react-native-fbsdk-next';

export const initializeFacebookSDK = () => {
  Settings.initializeSDK();
  Settings.setAppID('1975469632391920');
  Settings.setClientToken('596616160118107');
}; 