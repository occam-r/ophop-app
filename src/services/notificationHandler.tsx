import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { navigate, routeExists } from './navigationService';
import firebase from '@react-native-firebase/app';
import notifee, { AndroidImportance } from '@notifee/react-native';
// Check if notifications are enabled
export async function checkNotificationPermission() {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      return granted;
    } else {
      const authStatus = await messaging().hasPermission();
      return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
             authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    }
  } catch (error) {
    console.error('Error checking notification permission:', error);
    return false;
  }
}

// Request permission for notifications
export async function requestUserPermission() {
  try {
    if (Platform.OS === 'android') {
      // For Android 13 and above
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app needs notification permission to send you important updates.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
          return true;
        } else {
          console.log('Notification permission denied');
          return false;
        }
      }
    } else if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

// Request permission if not already granted
export async function ensureNotificationPermission() {
  const hasPermission = await checkNotificationPermission();
  if (!hasPermission) {
    const granted = await requestUserPermission();
    if (granted) {
      // Setup notification channels after permission is granted
      await setupNotificationChannels();
      // Get and store FCM token
      await getFCMToken();
    }
    return granted;
  }
  return true;
}

// Get FCM token
export async function getFCMToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');

  if (!fcmToken) {
    try {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  }
  return fcmToken;
}

// Handle notification when app is in foreground
export function onMessageReceived() {
  return messaging().onMessage(async remoteMessage => {
    console.log('Received foreground message:', remoteMessage);
    
    // Handle different notification types
    switch (remoteMessage.data.type) {
      case 'message':
        Alert.alert(
          'New Message',
          `${remoteMessage.data.senderName}: ${remoteMessage.data.message}`,
          [
            {
              text: 'View',
              onPress: () => {
                if (routeExists('Chat')) {
                  navigate('Chat', { 
                    chatId: remoteMessage.data.chatId,
                    senderId: remoteMessage.data.senderId,
                    senderName: remoteMessage.data.senderName,
                    message: remoteMessage.data.message
                  });
                } else {
                  Alert.alert(
                    'Navigation Error',
                    'Chat screen is not available. Please try again later.',
                    [{ text: 'OK' }]
                  );
                }
              },
            },
            {
              text: 'Close',
              style: 'cancel',
            },
          ]
        );
        break;

      case 'friend_request':
        Alert.alert(
          'New Friend Request',
          `${remoteMessage.data.senderName} sent you a friend request`,
          [
            {
              text: 'View',
              onPress: () => {
                if (routeExists('FriendRequests')) {
                  navigate('FriendRequests', {
                    requestId: remoteMessage.data.requestId,
                    senderId: remoteMessage.data.senderId,
                    senderName: remoteMessage.data.senderName
                  });
                } else {
                  Alert.alert(
                    'Navigation Error',
                    'Friend Requests screen is not available. Please try again later.',
                    [{ text: 'OK' }]
                  );
                }
              },
            },
            {
              text: 'Close',
              style: 'cancel',
            },
          ]
        );
        break;

      case 'friend_request_accepted':
        Alert.alert(
          'Friend Request Accepted',
          `${remoteMessage.data.senderName} accepted your friend request`,
          [
            {
              text: 'View',
              onPress: () => {
                if (routeExists('Friends')) {
                  navigate('Friends', {
                    friendId: remoteMessage.data.senderId,
                    friendName: remoteMessage.data.senderName
                  });
                } else {
                  Alert.alert(
                    'Navigation Error',
                    'Friends screen is not available. Please try again later.',
                    [{ text: 'OK' }]
                  );
                }
              },
            },
            {
              text: 'Close',
              style: 'cancel',
            },
          ]
        );
        break;

      default:
        Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    }
  });
}

// Handle notification when app is in background
export function onNotificationOpenedApp() {
  return messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification opened app from background state:', remoteMessage);
    handleNotificationNavigation(remoteMessage);
  });
}

// Handle notification when app is closed
export async function checkInitialNotification() {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    console.log('Notification opened app from quit state:', remoteMessage);
    handleNotificationNavigation(remoteMessage);
  }
}

// Helper function to handle navigation based on notification type
function handleNotificationNavigation(remoteMessage) {
  try {
    const { type, chatId, senderId, senderName, message } = remoteMessage.data;
    
    switch (type) {
      case 'message':
        if (routeExists('Chat')) {
          navigate('Chat', { 
            chatId,
            senderId,
            senderName,
            message
          });
        } else {
          console.error('Chat screen not available');
        }
        break;
      case 'friend_request':
        if (routeExists('FriendRequests')) {
          navigate('FriendRequests', {
            requestId: remoteMessage.data.requestId,
            senderId,
            senderName
          });
        } else {
          console.error('FriendRequests screen not available');
        }
        break;
      case 'friend_request_accepted':
        if (routeExists('Friends')) {
          navigate('Friends', {
            friendId: senderId,
            friendName: senderName
          });
        } else {
          console.error('Friends screen not available');
        }
        break;
      default:
        console.warn('Unknown notification type:', type);
    }
  } catch (error) {
    console.error('Error handling notification navigation:', error);
    Alert.alert(
      'Navigation Error',
      'An error occurred while trying to open the notification. Please try again.',
      [{ text: 'OK' }]
    );
  }
}

// Set up notification channels for Android
export async function setupNotificationChannels() {
  try {
    if (Platform.OS === 'android') {
      // Create "Messages" channel
      await notifee.createChannel({
        id: 'messages',
        name: 'Messages',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        lights: true,
        description: 'Chat messages and conversations',
        badge: true,
      });

      // Create "Friend Requests" channel
      await notifee.createChannel({
        id: 'friend_requests',
        name: 'Friend Requests',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        lights: true,
        description: 'Friend request notifications',
        badge: true,
      });

      console.log('Notification channels setup completed');
    }
  } catch (error) {
    console.error('Error setting up notification channels:', error);
  }
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
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      android: {
        channelId: data.type === 'message' ? 'messages' : 'friend_requests',
        priority: 'high',
        notification: {
          channelId: data.type === 'message' ? 'messages' : 'friend_requests',
          priority: 'high',
          sound: 'default',
          defaultSound: true,
          defaultVibrateTimings: true,
          defaultLightSettings: true,
          visibility: 'public',
          importance: 'high',
          showWhen: true,
          autoCancel: true,
          badge: true,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            contentAvailable: true,
            mutableContent: true,
            category: data.type === 'message' ? 'MESSAGE' : 'FRIEND_REQUEST',
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