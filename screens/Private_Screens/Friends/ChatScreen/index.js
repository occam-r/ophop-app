import notifee, { AndroidImportance } from '@notifee/react-native';
import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Platform, Text, View } from "react-native";
import Button_Comp from "../../../../utilities/Button_Comp";
import { light_theme, theme_color } from "../../../../utilities/colors";
import { Sidebar_Toggle_Bar } from "../../../Sidebar/Sidebar_Toggle";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
// import Chats from "./Chats";
import database from "@react-native-firebase/database";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { set_loading_action } from "../../../../redux_prog/actions/base_action";
import { confirm_Alert } from "../../../../utilities/Alert_comp";
// import { get_shops_slash_msg_api } from "../../../../apis";
import { get_messages_api, store_message_api } from "../../../../apis";
import Flex_Box from "../../../../utilities/Flex_Box";
import Modal_Comp from "../../../../utilities/Modal_Comp";
// import { VisionCamera } from "./VisionCamera";
import messaging from '@react-native-firebase/messaging';

// Android notification channel constants
const ANDROID_CHANNEL_ID = 'chat_messages';
const ANDROID_CHANNEL_NAME = 'Chat Messages';
const ANDROID_IMPORTANCE_HIGH = 4;

const ChatScreen = ({ navigation }) => {
  const IsFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state?.authReducer);
  const state = route?.params?.contact;
  const { backgroundColor, grey, dark_grey } = light_theme;
  const { user_data } = useSelector((state) => state?.authReducer);
  const sender_id = user_data?.userid;
  const receiver_id = state?.id;
  const [modalVisible, setmodalVisible] = useState(false);
  const [messages, setmessages] = useState([]);
  const [processedMessageIds, setProcessedMessageIds] = useState(new Set());
  const [isPolling, setIsPolling] = useState(true);
  const [lastMessageId, setLastMessageId] = useState(null);
  const room_id = state?.room_id;

  // console.warn({ room_id });

  // Request notification permissions
  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: "Notification Permission",
            message: "App needs notification permission to send you messages",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      }

      // Request FCM permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('FCM Authorization status:', authStatus);
        // Get FCM token
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  // Set up notification channels and handlers
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Request permissions first
        await requestNotificationPermission();

        if (Platform.OS === 'android') {
          try {
            await notifee.createChannel({
              id: ANDROID_CHANNEL_ID,
              name: ANDROID_CHANNEL_NAME,
              importance: AndroidImportance.HIGH,
              vibration: true,
              sound: 'default',
              lights: true,
              description: 'Chat message notifications',
              badge: true,
            });

            console.log('Notification channel created successfully');
          } catch (error) {
            console.error('Failed to create notification channel:', error);
          }
        }

        // Subscribe to the chat room topic
        if (room_id) {
          await messaging().subscribeToTopic(`chat_${room_id}`);
          console.log('Subscribed to chat topic:', `chat_${room_id}`);
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();

    // Cleanup subscription when leaving the chat
    return () => {
      if (room_id) {
        messaging().unsubscribeFromTopic(`chat_${room_id}`);
        console.log('Unsubscribed from chat topic:', `chat_${room_id}`);
      }
    };
  }, [room_id]);

  // Handle foreground messages
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Received foreground message:', remoteMessage);

      if (remoteMessage.data?.type === 'message' && remoteMessage.data?.chatId === room_id) {
        // Only add message if it's not from the current user
        if (remoteMessage.data.senderId !== sender_id) {
          // Temporarily disable polling
          setIsPolling(false);

          const newMessage = {
            message: remoteMessage.data.message,
            senderId: remoteMessage.data.senderId,
            senderName: remoteMessage.data.senderName,
            timestamp: remoteMessage.data.timestamp,
            id: remoteMessage.data.messageId || `${remoteMessage.data.senderId}_${Date.now()}`
          };

          setmessages(prevMessages => {
            const messageMap = new Map();
            prevMessages.forEach(msg => messageMap.set(msg.id, msg));
            messageMap.set(newMessage.id, newMessage);
            return Array.from(messageMap.values()).sort((a, b) =>
              new Date(a.timestamp) - new Date(b.timestamp)
            );
          });

          // Re-enable polling after a short delay
          setTimeout(() => setIsPolling(true), 1000);
        }
      }
    });

    return unsubscribe;
  }, [room_id, sender_id]);

  // Handle background/quit state messages
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Received background message:', remoteMessage);
      // Handle background messages here if needed
    });

    // Check for initial notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from quit state by notification:', remoteMessage);
          // Handle initial notification here if needed
        }
      });
  }, []);

  useEffect(() => {
    if (state?.chatMessage && route.name == "ChatScreen") {
      setmodalVisible(true);
    }
  }, [state]);

  const get_messages = () => {
    if (!room_id || !token || !isPolling) return;

    get_messages_api(room_id, token)
      .then((res) => {
        if (res?.data?.data) {
          const newMessages = res.data.data.map(msg => ({
            ...msg,
            id: msg.id || `${msg.senderId}_${msg.timestamp}_${Date.now()}` // Ensure unique ID with timestamp
          }));

          setmessages(prevMessages => {
            // Create a Map to track unique messages by ID
            const messageMap = new Map();

            // Add existing messages to the map
            prevMessages.forEach(msg => messageMap.set(msg.id, msg));

            // Add new messages, overwriting any duplicates
            newMessages.forEach(msg => messageMap.set(msg.id, msg));

            // Convert map back to array and sort by timestamp
            return Array.from(messageMap.values()).sort((a, b) =>
              new Date(a.timestamp) - new Date(b.timestamp)
            );
          });
        }
      })
      .catch((err) => {
        console.warn('Error fetching messages:', err);
      });
  };

  useEffect(() => {
    if (!IsFocused) return;

    // Initial message fetch
    get_messages();

    const interval = setInterval(() => {
      if (isPolling) {
        get_messages();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [room_id, IsFocused, isPolling]);

  // Clear processed message IDs when changing rooms
  useEffect(() => {
    setProcessedMessageIds(new Set());
  }, [room_id]);

  const send_message = async (message_obj, func) => {
    dispatch(set_loading_action(true));
    try {
      // Temporarily disable polling
      setIsPolling(false);

      const msg_res = await store_message_api(room_id, message_obj, token);

      if (msg_res?.data?.data) {
        // Don't update messages here, let polling handle it
        func();
      }

      // Re-enable polling after a short delay
      setTimeout(() => {
        setIsPolling(true);
      }, 1000);

      dispatch(set_loading_action(false));
    } catch (error) {
      setIsPolling(true);
      dispatch(set_loading_action(false));
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    // setmessages([]);
    // dispatch(set_loading_action(true));
    // const userMessagesRef = database()
    //   .ref("user-message")
    //   .child("0")
    //   .child(receiver_id)
    //   .child(sender_id);

    // const onChildAdded = userMessagesRef.on("child_added", (snapshot) => {
    //   const messageId = snapshot.key;
    //   const messagesRef = database().ref("message").child("0").child(messageId);

    //   messagesRef.once("value", (snapshot) => {
    //     const messageData = snapshot.val();
    //     if (messageData) {
    //       console.warn(messageData);
    //       // setmessages((prevMessages) => [
    //       //   ...prevMessages,
    //       //   { ...messageData, messageId },
    //       // ]);
    //     }
    //   });
    // });

    // dispatch(set_loading_action(false));
    // // Cleanup listener on component unmount
    // return () => userMessagesRef.off("child_added", onChildAdded);
  }, [receiver_id, sender_id]);

  const delet_msg = (id) => {
    const messagesRef = database().ref("message").child("0").child(id).remove();
    setmessages(
      messages?.filter((el) => {
        return el?.messageId != id;
      })
    );
    return messagesRef;
  };

  const delete_chat = () => {
    confirm_Alert("Delete!", "Do you want to delete this chat?", async () => {
      dispatch(set_loading_action(true));
      await database()
        .ref("user-message")
        .child("0")
        .child(receiver_id)
        .child(sender_id)
        .remove();
      setmessages([]);
      dispatch(set_loading_action(false));
    });
  };

  return (
    <>
      <Sidebar_Toggle_Bar
        func={() => {
          setmodalVisible(false);
          navigation?.goBack();
        }}
        label={
          state?.contactName?.length > 16
            ? state?.contactName?.slice(0, 16) + ".."
            : state?.contactName
        }
        sub_route={true}
        suffix={
          <Button_Comp
            label={"Delete"}
            btn_style={{
              paddingVertical: 7,
              paddingHorizontal: 10,
              marginTop: -6,
              backgroundColor,
            }}
            text_style={{
              color: theme_color,
            }}
            onClick={delete_chat}
          />
        }
      />
      {/* <MsgScreen room_id={state?.room_id} /> */}
      <Messages
        messages={messages}
        setmessages={setmessages}
        delet_msg={delet_msg}
        navigation={navigation}
      />
      <ChatInput
        setmessages={setmessages}
        send_message={send_message}
        receiver_id={receiver_id}
        room_id={room_id}
      />
      <Modal_Comp
        modalVisible={modalVisible}
        setModalVisible={setmodalVisible}
        non_closable={false}
      >
        <View
          style={{
            paddingHorizontal: 15,
            width: "100%",
          }}
        >
          <Flex_Box
            style={{
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: dark_grey,
              }}
            >
              {state?.chatMessage}
            </Text>
            <Button_Comp
              label={"Close"}
              onClick={() => {
                setmodalVisible(false);
              }}
              btn_style={{
                width: "45%",
                paddingVertical: 10,
                backgroundColor,
                borderWidth: 2,
                borderColor: theme_color,
              }}
              text_style={{
                color: theme_color,
              }}
            />
          </Flex_Box>
        </View>
      </Modal_Comp>
    </>
  );
};

export default ChatScreen;
