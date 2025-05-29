import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Navigation_Comp from "./screens/Navigation_Comp";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { persistor, store } from "./redux_prog/store/store";
import BootSplash from "react-native-bootsplash";

import { PersistGate } from "redux-persist/integration/react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { initializeFacebookSDK } from "./src/services/facebookInit";
import { configureGoogleSignIn } from "./src/services/googleAuth";
import {
  requestUserPermission,
  getFCMToken,
  onMessageReceived,
  onNotificationOpenedApp,
  checkInitialNotification,
  setupNotificationChannels
} from "./src/services/notificationHandler";
// import Appp from "././Pratyaksh/Appp";

const App = () => {
  useEffect(() => {
    // Initialize Facebook SDK
    initializeFacebookSDK();
    
    // Initialize Google Sign-In
    configureGoogleSignIn();
    
    // Initialize notifications
    const initializeNotifications = async () => {
      await requestUserPermission();
      await setupNotificationChannels();
      const token = await getFCMToken();
      console.log('FCM Token:', token);
      
      // Set up notification listeners
      const unsubscribe = onMessageReceived();
      const unsubscribeOpened = onNotificationOpenedApp();
      
      // Check for initial notification
      await checkInitialNotification();
      
      // Cleanup listeners on unmount
      return () => {
        unsubscribe();
        unsubscribeOpened();
      };
    };
    
    initializeNotifications();
    
    setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, 500);
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StripeProvider publishableKey="pk_test_51PkgeLHkmv4NiwRYoU7qXRWvLRJc3ALKn5mSKLsKLrxZTCpAjNQ1YnqPEI3BV7zH5uWdxdGWy3VMWLgxaUDMI3Nd0087KOB3NE">
            <Navigation_Comp />
          </StripeProvider>
        </PersistGate>
      </Provider>
      {/* <Appp/> */}
    </>
  );
};

export default App;
