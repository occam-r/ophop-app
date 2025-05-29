import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  light_theme,
  light_theme_bg,
  theme_color,
} from "../../../../utilities/colors";
import Flex_Box from "../../../../utilities/Flex_Box";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import {
  convertDays,
  getDateDifference,
} from "../../../../utilities/utilities";
import Button_Comp from "../../../../utilities/Button_Comp";

const MessageBox = ({
  item,
  index,
  messages,
  setmessages,
  userid,
  delet_msg,
  navigation,
}) => {
  const { backgroundColor, text_color, grey, dark_grey } = light_theme;
  // toId, fromId, timestamp, message
console.warn({userid});


  const from_self = item?.userId == userid;

  const msg_time = getDateDifference(
    new Date(),
    new Date(item?.timeStamp)
  );

  return (
    <Flex_Box
      style={{
        flexDirection: "row",
        justifyContent: from_self ? "flex-end" : "start",
        marginTop: 10,
        zIndex: 100,
      }}
    >
      <Flex_Box
        style={{
          backgroundColor: light_theme_bg,
          borderRadius: 8,
          padding: 15,
          width: "50%",
          alignItems: "start",
        }}
      >
        {item?.messageText && (
          <Text
            style={{
              color: theme_color,
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            {item?.messageText}
          </Text>
        )}
        {item?.image && (
          <Image
            source={{ uri: item?.image }}
            style={{
              height: 80,
              width: 80,
            }}
          />
        )}
        {item?.shopLinkName && (
          <>
            <Flex_Box
              style={{
                flexDirection: "row",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              <Text
                style={{
                  color: dark_grey,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Tap button to view
              </Text>
              <Text
                style={{
                  color: text_color,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {item?.shopLinkName}
              </Text>
            </Flex_Box>
            <Button_Comp
              label={"View"}
              btn_style={{
                paddingVertical: 12,
                marginVertical: 5,
              }}
              onClick={() => {
                navigation?.navigate("Store Details", {
                  id: item?.shopId,
                });
              }}
            />
          </>
        )}
        <Flex_Box
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
            position: "relative",
            zIndex: 100,
          }}
        >
          <Text
            style={{
              color: text_color,
            }}
          >
            {msg_time?.result_suffix == " days"
              ? convertDays(msg_time?.diffInDays)
              : msg_time?.result}{" "}
            ago
          </Text>
          <TouchableOpacity
            onPress={() => {
              console.warn(item);

              setmessages(
                messages?.map((el, ind) => {
                  if (index == ind) {
                    return {
                      ...el,
                      deletemodal: item?.deletemodal ? false : true,
                    };
                  } else {
                    return {
                      ...el,
                      deletemodal: false,
                    };
                  }
                })
              );
            }}
          >
            <Entypo name="dots-three-vertical" size={15} color={grey} />
          </TouchableOpacity>
          {item?.deletemodal && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: -40,
                right: -10,
                zIndex: 1000,
              }}
              onPress={() => {
                delet_msg(item?.id);
              }}
            >
              <Flex_Box
                style={{
                  flexDirection: "row",
                  gap: 5,
                  backgroundColor,
                  borderWidth: 1,
                  borderColor: grey,
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingRight: 5,
                  width: 80,
                }}
              >
                <MaterialCommunityIcons
                  name="delete-forever-outline"
                  size={20}
                  color="red"
                />
                <Text
                  style={{
                    color: text_color,
                    fontSize: 14,
                  }}
                >
                  Delete
                </Text>
              </Flex_Box>
            </TouchableOpacity>
          )}
        </Flex_Box>
      </Flex_Box>
    </Flex_Box>
  );
};

const Messages = ({ navigation, messages, setmessages, delet_msg }) => {
  const { backgroundColor, text_color, grey } = light_theme;
  const { user_data } = useSelector((state) => state?.authReducer);

  const flatListRef = useRef(null);

  console.warn(user_data);
  

  useEffect(() => {
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: messages?.length - 1,
        animated: true,
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [messages]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        paddingHorizontal: 10,
        paddingBottom: 80,
      }}
    >
      {messages?.length > 0 && (
        <FlatList
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={messages}
          keyExtractor={(item) => item.id || `${item.senderId}_${item.timestamp}_${Math.random().toString(36).substr(2, 9)}`}
          renderItem={({ item, index }) => {
            return (
              <MessageBox
                item={item}
                index={index}
                setmessages={setmessages}
                messages={messages}
                userid={user_data?.userid}
                delet_msg={delet_msg}
                navigation={navigation}
              />
            );
          }}
        />
      )}
    </View>
  );
};

export default Messages;
