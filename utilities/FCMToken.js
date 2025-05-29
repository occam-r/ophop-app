import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';

// Get FCM token
export async function getFCMToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('Stored FCM Token:', fcmToken);

  if (!fcmToken) {
    try {
      fcmToken = await messaging().getToken();
      console.log('New FCM Token generated:', fcmToken);
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  }
  return fcmToken;
}

// Send FCM notification directly
export async function sendFCMNotification(targetFCMToken, title, body, data = {}) {
  try {
    if (!targetFCMToken) {
      throw new Error('Target FCM token is required');
    }

    console.log('Preparing to send notification to token:', targetFCMToken);
    console.log('Notification data:', { title, body, data });

    const message = {
      token: targetFCMToken,
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK', // This helps with notification click handling
      },
      android: {
        channelId: 'friend_requests',
        priority: 'high',
        notification: {
          channelId: 'friend_requests',
          priority: 'high',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    console.log('Sending FCM message:', JSON.stringify(message, null, 2));

    const response = await firebase.messaging().sendMessage(message);
    console.log('Successfully sent notification:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    if (error.code) {
      console.error('Firebase error code:', error.code);
      console.error('Firebase error message:', error.message);
    }
    throw error;
  }
} 