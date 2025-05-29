import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

export async function onFacebookButtonPress() {
  try {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      throw new Error('User cancelled the login process');
    }

    // Get the access token
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw new Error('Something went wrong obtaining access token');
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  } catch (error) {
    console.error(error);
    throw error;
  }
} 