import React, { useEffect } from "react";
import BootSplash from "react-native-bootsplash";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { persistor, store } from "./redux_prog/store/store";
import Navigation_Comp from "./screens/Navigation_Comp";

import { StripeProvider } from "@stripe/stripe-react-native";
import { PersistGate } from "redux-persist/integration/react";
import { initializeFacebookSDK } from "./src/services/facebookInit";
import { configureGoogleSignIn } from "./src/services/googleAuth";
import {
  checkInitialNotification,
  onMessageReceived,
  onNotificationOpenedApp,
  requestLocationPermission,
  requestNotificationPermission,
  setupNotificationChannels
} from "./src/services/notificationHandler";

const App = () => {
  useEffect(() => {
    // Initialize Facebook SDK
    initializeFacebookSDK();

    // Initialize Google Sign-In
    configureGoogleSignIn();

    // Initialize notifications
    const initializeNotifications = async () => {
      await requestNotificationPermission();
      await requestLocationPermission();
      await setupNotificationChannels();
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
    BootSplash.hide({ fade: true }).then(initializeNotifications);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StripeProvider publishableKey="pk_test_51PkgeLHkmv4NiwRYoU7qXRWvLRJc3ALKn5mSKLsKLrxZTCpAjNQ1YnqPEI3BV7zH5uWdxdGWy3VMWLgxaUDMI3Nd0087KOB3NE">
          <Navigation_Comp />
        </StripeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
