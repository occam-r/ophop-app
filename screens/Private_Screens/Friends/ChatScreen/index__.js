import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Sidebar_Toggle_Bar } from "../../../Sidebar/Sidebar_Toggle";
import Button_Comp from "../../../../utilities/Button_Comp";
import { light_theme, theme_color } from "../../../../utilities/colors";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
// import Chats from "./Chats";
import database from "@react-native-firebase/database";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { set_loading_action } from "../../../../redux_prog/actions/base_action";
import { confirm_Alert } from "../../../../utilities/Alert_comp";
// import { get_shops_slash_msg_api } from "../../../../apis";
import Modal_Comp from "../../../../utilities/Modal_Comp";
import Flex_Box from "../../../../utilities/Flex_Box";
// import MsgScreen from "../../../Pusher_Comp/Messaging_Comp";
import { Pusher } from "@pusher/pusher-websocket-react-native";
import {
  delete_chat_api,
  get_chat_msgs_api,
  store_message_api,
} from "../../../../apis";
// import { VisionCamera } from "./VisionCamera";

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
  const room_id = state?.room_id;
  const [messages, setmessages] = useState([]);

  useEffect(() => {
    if (state?.chatMessage && route.name == "ChatScreen") {
      setmodalVisible(true);
    }
  }, [state]);

  //   console.warn(user_data);

  const send_message = async (message_obj, func) => {
    dispatch(set_loading_action(true));
    try {
      const msg_res = await store_message_api(room_id, message_obj, token);
      setmessages([...messages, msg_res?.data?.data]);
      func();
      // await pusher?.trigger(room_id, `NewChatMessage`, {
      //   message: message_obj?.message,
      // });
      dispatch(set_loading_action(false));
    } catch (error) {
      dispatch(set_loading_action(false));
      console.error(error);
    }
  };

  const delet_msg = async (id) => {
    await delete_msg_api(id, token);
    setmessages(
      messages?.filter((el) => {
        return el?.messageId != id;
      })
    );
  };

  const delete_chat = () => {
    confirm_Alert("Delete!", "Do you want to delete this chat?", async () => {
      await delete_chat_api(room_id, token);
      dispatch(set_loading_action(true));
      setmessages([]);
      dispatch(set_loading_action(false));
    });
  };

  const [receivedMessage, setReceivedMessage] = useState(""); // New state for receiving messages
  // const pusher = Pusher.getInstance();
  //   const token = useSelector((state) => state?.authReducer?.token);

  useEffect(() => {
    // const initializePusher = async () => {
    //   await pusher.init({
    //     apiKey: "3a6e8a2b4fa47e629a65", // Replace with your Pusher App Key
    //     cluster: "ap4", // Replace with your Pusher Cluster
    //     authEndpoint: `${BASE_URL}/broadcasting/auth`,
    //     auth: { headers: { Authorization: `Bearer ${token}` } },
    //   });
    //   await pusher.connect();

    //   // Subscribe to a private channel
    //   const channel = await pusher.subscribe({
    //     channelName: room_id,
    //   });

    //   // Listen for messages sent by the driver
    //   channel.bind(
    //     `private-chat-${room_id}.App\\Events\\NewChatMessage`,
    //     (event) => {
    //       setReceivedMessage(event.data.message);
    //       setmessages([
    //         ...messages,
    //         {
    //           authorName: state?.contactName,
    //           avatarBackground: "hsla(22,100%,38%,1)",
    //           chatRoomId: room_id,
    //           id: messages?.length + 1,
    //           image: null,
    //           messageText: event.data.message,
    //           userId: receiver_id,
    //           viewed: true,
    //         },
    //       ]);
    //     }
    //   );
    // };

    // initializePusher();

    // return () => {
    //   pusher.unsubscribe({ channelName: room_id });
    //   pusher.disconnect();
    // };
  }, []);

  const get_chat_msgs = () => {
console.warn({room_id});


    get_chat_msgs_api(room_id, token)
      .then((res) => {
        setmessages(res.data.data);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  useEffect(get_chat_msgs, []);

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
      <ChatInput setmessages={setmessages} send_message={send_message} />
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
