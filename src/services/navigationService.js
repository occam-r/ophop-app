import { createNavigationContainerRef } from '@react-navigation/native';
import { Alert } from 'react-native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  try {
    if (!navigationRef.isReady()) {
      console.warn('Navigation not ready, attempting to navigate to:', name);
      return false;
    }

    // Check if the route exists
    const state = navigationRef.getRootState();
    const routeExists = state.routes.some(route => route.name === name);
    
    if (!routeExists) {
      console.error(`Navigation failed: Route "${name}" does not exist`);
      Alert.alert(
        'Navigation Error',
        'Unable to open the requested screen. Please try again later.',
        [{ text: 'OK' }]
      );
      return false;
    }

    navigationRef.navigate(name, params);
    return true;
  } catch (error) {
    console.error('Navigation error:', error);
    Alert.alert(
      'Navigation Error',
      'An error occurred while trying to navigate. Please try again.',
      [{ text: 'OK' }]
    );
    return false;
  }
}

export function goBack() {
  try {
    if (!navigationRef.isReady()) {
      console.warn('Navigation not ready, cannot go back');
      return false;
    }

    const state = navigationRef.getRootState();
    if (state.routes.length <= 1) {
      console.warn('Cannot go back: Already at root');
      return false;
    }

    navigationRef.goBack();
    return true;
  } catch (error) {
    console.error('Navigation error:', error);
    Alert.alert(
      'Navigation Error',
      'An error occurred while trying to go back. Please try again.',
      [{ text: 'OK' }]
    );
    return false;
  }
}

// Helper function to check if a route exists
export function routeExists(name) {
  try {
    if (!navigationRef.isReady()) return false;
    const state = navigationRef.getRootState();
    return state.routes.some(route => route.name === name);
  } catch (error) {
    console.error('Error checking route existence:', error);
    return false;
  }
} 