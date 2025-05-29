import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Modal_Comp from "../../../utilities/Modal_Comp";
import Form_Item from "../../../utilities/Form_Item";
import Flex_Box from "../../../utilities/Flex_Box";
import Button_Comp from "../../../utilities/Button_Comp";
import { light_theme, theme_color } from "../../../utilities/colors";
import Entypo from "react-native-vector-icons/Entypo";
import database from "@react-native-firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { set_loading_action } from "../../../redux_prog/actions/base_action";
import { useRoute } from "@react-navigation/native";
import { get_rooms_api, send_shop_message_api } from "../../../apis";
import return_error from "../../../utilities/Return_Error";
import Alert_comp from "../../../utilities/Alert_comp";
// import { Pusher } from "@pusher/pusher-websocket-react-native";

const MessageModal = ({ navigation, store_details }) => {
  // const pusher = Pusher.getInstance();
  const route = useRoute();
  const { backgroundColor, dark_grey, light_grey } = light_theme;
  const dispatch = useDispatch();
  const [modalVisible, setmodalVisible] = useState(false);
  const { user_data, token } = useSelector((state) => state?.authReducer);
  const [message, setmessage] = useState("");
  const { shopName } = store_details || {};
  const { current_location, nearby_shops } = useSelector(
    (state) => state?.baseReducer
  );
  const sender_id = user_data?.userid;
  const receiver_id = route?.params?.id;
  const firebase_msg_func = async (msg) => {
    dispatch(set_loading_action(true));
    const ref = database().ref("message").child("0");
    const childRef = ref.push(); // Generates a new child location with a unique key

    const toId = `${receiver_id}`;
    const fromId = `${sender_id}`;
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

    let values = {
      toId,
      fromId,
      timestamp,
      message: msg || message,
    };

    try {
      await childRef.update(values);
      // Reset text input and button state if needed (pseudo-code)
      // this.setState({ text: '', sendButtonTag: 0 });

      const messageId = childRef.key;

      const userMessagesRef = database()
        .ref("user-message")
        .child("0")
        .child(fromId)
        .child(toId)
        .child(messageId);
      await userMessagesRef.set(1);

      const recipientUserMessagesRef = database()
        .ref("user-message")
        .child("0")
        .child(toId)
        .child(fromId)
        .child(messageId);
      await recipientUserMessagesRef.set(1);
      dispatch(set_loading_action(false));
      // Alert_comp("Success", "Successfully shared!");
      // navigation?.navigate("ChatScreen", {
      //   contact: {
      //     id: receiver_id,
      //     contactName: shopName,
      //   },
      // });
      get_rooms();
      // setmodalVisible(false);
    } catch (error) {
      dispatch(set_loading_action(false));
      console.error(error);
    }
  };

  const pusher_msg_func = async (msg,room_id) => {
    await pusher.trigger(
      room_id,
      `private-chat-${room_id}.App\\Events\\NewChatMessage`,
      {
        message: msg,
      }
    );
    await store_message_api(room_id, { message: msg }, token);
  };

  const send_shop_message = (msg) => {
    send_shop_message_api(
      receiver_id,
      {
        message: msg || message,
      },
      token
    )
      .then((res) => {
      get_rooms();
      // firebase_msg_func(msg);
      })
      .catch((err) => {
        console.error(err);
        console.error(return_error(err));
      });
  };

  const get_rooms = () => {
    dispatch(set_loading_action(true));
    get_rooms_api(token)
      .then((res) => {
        dispatch(set_loading_action(false));
        const r_id = res.data?.data?.filter((el) => {
          return el?.userName == shopName;
        })[0];

        console.warn("==============================>");
        console.warn(r_id);
        console.warn("==============================>");

        if (r_id?.id) {
          // pusher_msg_func(r_id?.id,)
          navigation?.navigate("ChatScreen", {
            contact: {
              id: receiver_id,
              contactName: shopName,
              room_id: r_id?.id,
              chatMessage: r_id?.chatMessage,
            },
          });
        } else {
          send_shop_message("Hello");
        }
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.error(return_error(err));
      });
  };

  console.warn(JSON.stringify(store_details.isChatEnabled));
  const shop_data =
  nearby_shops?.filter((el) => {
    return el?.id == route?.params?.id;
  })[0] || {};

const additional_shop_data = { ...store_details, ...shop_data };

  return (
    <>
    <Flex_Box>
    {
      additional_shop_data?.isChatEnabled &&
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 5,
        }}
        onPress={() => {
          get_rooms();
        }}
      >
        <Flex_Box
          style={{
            backgroundColor: dark_grey,
            borderRadius: 150,
            padding: 8,
            width: "",
          }}
        >
          <Entypo name="message" size={40} color="#fff" />
        </Flex_Box>
      </TouchableOpacity>
    }
      <Modal_Comp
        modalVisible={modalVisible}
        setModalVisible={setmodalVisible}
        label={"Send Message"}
      >
        <View
          style={{
            //   paddingVertical: 10,
            paddingHorizontal: 15,
            width: "100%",
          }}
        >
          <Form_Item
            label={"Enter Data"}
            style={{
              paddingVertical: 5,
            }}
            value={message}
            onchange={(e) => {
              setmessage(e);
            }}
          />
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Button_Comp
              label={"Send"}
              onClick={() => {
                //   navigation?.navigate("ChatScreen");
                if (message && message?.length <= 250) {
                  send_shop_message();
                }
              }}
              btn_style={{
                width: "45%",
                paddingVertical: 10,
                borderWidth: 2,
                borderColor: theme_color,
              }}
            />
            <Button_Comp
              label={"Cancel"}
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
    </Flex_Box>
    </>
  );
};

export default MessageModal;
