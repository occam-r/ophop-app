import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

// Initialize Google Sign-In
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '61997329081-4ssos9blcnirah5ge6bhmmusibf24n3e.apps.googleusercontent.com',
  });
};

export const onGoogleButtonPress = async () => {
  try {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}; 