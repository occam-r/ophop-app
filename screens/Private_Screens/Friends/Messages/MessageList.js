import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Flex_Box from "../../../../utilities/Flex_Box";
import {
  getDateDifference,
  getUserInitials,
  Not_Found_Text,
} from "../../../../utilities/utilities";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { light_theme } from "../../../../utilities/colors";
import { get_rooms_api } from "../../../../apis";
import return_error from "../../../../utilities/Return_Error";
import { useIsFocused } from "@react-navigation/native";
import { set_loading_action } from "../../../../redux_prog/actions/base_action";

const MessageList = ({ navigation }) => {
  const { token } = useSelector((state) => state?.authReducer);
  const IsFocused = useIsFocused();
  const dispatch = useDispatch();

  const [messageList, setmessageList] = useState([]);

  const get_rooms = () => {
    dispatch(set_loading_action(true));
    get_rooms_api(token)
      .then((res) => {
        dispatch(set_loading_action(false));
        setmessageList(res.data?.data);
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.error(return_error(err));
      });
  };

  const { text_color, grey } = light_theme;

  useEffect(get_rooms, [IsFocused]);

  return (
    <>
      {messageList?.length > 0 && (
        <FlatList
          style={{
            width: "100%",
          }}
          contentContainerStyle={{
            width: "100%",
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={messageList}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {

                  console.warn(JSON.stringify(item));
                  

                  navigation?.navigate("ChatScreen", {
                    contact: {
                      id: item?.user_id,
                      contactName: item?.userName,
                      room_id: item?.id,
                      chatMessage: item?.chatMessage,
                    },
                  });
                }}
              >
                <Flex_Box
                  style={{
                    justifyContent: "space-between",
                    paddingHorizontal: 15,
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: grey,
                    paddingVertical: 10,
                  }}
                >
                  <Flex_Box
                    style={{
                      width: "",
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Flex_Box
                      style={{
                        backgroundColor: item?.avatarBackground,
                        borderRadius: 50,
                        height: 40,
                        width: 40,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 600,
                          fontSize: 18,
                        }}
                      >
                        {getUserInitials(item?.userName)}
                      </Text>
                    </Flex_Box>
                    <View>
                      <Text
                        style={{
                          color: text_color,
                          fontWeight: 500,
                          fontSize: 16,
                        }}
                      >
                        {item?.userName}
                      </Text>

                      <Text
                        style={{
                          fontWeight: 500,
                          color: grey,
                          fontSize: 14,
                        }}
                      >
                        {item?.lastMessage}
                      </Text>
                    </View>
                  </Flex_Box>
                  <Text
                    style={{
                      fontWeight: 500,
                      color: grey,
                      fontSize: 12,
                    }}
                  >
                    {item?.lastMessageTimeStamp &&
                      getDateDifference(
                        new Date(item?.lastMessageTimeStamp),
                        new Date()
                      )?.result + " ago"}
                  </Text>
                </Flex_Box>
              </TouchableOpacity>
            );
          }}
        />
      )}
      {messageList?.length == 0 && (
        <Not_Found_Text text={`You don't have any messages!`} />
      )}
    </>
  );
};

export default MessageList;
