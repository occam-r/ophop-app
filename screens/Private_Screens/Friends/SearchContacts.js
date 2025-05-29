import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Flex_Box from "../../../utilities/Flex_Box";
import { getUserInitials } from "../../../utilities/utilities";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { light_theme } from "../../../utilities/colors";
import Form_Item from "../../../utilities/Form_Item";
import Modal_Comp from "../../../utilities/Modal_Comp";
import { find_users_api, sendRequest_api, unsend_request_api } from "../../../apis";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getFCMToken, sendFCMNotification } from "../../../utilities/FCMToken";
import Alert_comp from "../../../utilities/Alert_comp";

const SearchContacts = ({ navigation, modalVisible, setmodalVisible }) => {
  const { contacts } = useSelector((state) => state?.baseReducer);
  const { token } = useSelector((state) => state?.authReducer);
  const { text_color, grey } = light_theme;

  const [search_text, setsearch_text] = useState("");
  const [filtred_arr, setfiltred_arr] = useState([]);

  // const filtred_arr =
  //   contacts?.length > 0 &&
  //   contacts?.filter((el) => {
  //     if (search_text) {
  //       return JSON.stringify(el?.contactName)
  //         ?.toLowerCase()
  //         ?.includes(search_text?.toLowerCase());
  //     } else {
  //       return true;
  //     }
  //   });

  const find_friends = () => {
    if (search_text) {
      find_users_api(search_text, token)
        .then((res) => {
          setfiltred_arr(res.data?.data?.searchResults);
          console.warn(res.data?.data?.searchResults[0]);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setfiltred_arr([]);
    }
  };

  const send_request = async (user_id) => {
    try {
      if (!token) {
        Alert_comp("Error", "Authentication token is missing. Please login again.");
        return;
      }

      // Get the target user's details before sending request
      const targetUser = filtred_arr.find(user => user.id === user_id);
      if (!targetUser) {
        Alert_comp("Error", "User not found. Please try again.");
        return;
      }

      // First send the friend request
      const res = await sendRequest_api(user_id, token);
      console.log('Friend request response:', res.data);
      
      if (res.data.status) {
        // Send FCM notification if we have the token
        if (targetUser.fcm_token) {
          try {
            const notificationResponse = await sendFCMNotification(
              targetUser.fcm_token,
              'New Friend Request',
              `${targetUser.contactName} sent you a friend request`,
              {
                type: 'friend_request',
                requestId: user_id,
                senderId: user_id,
                senderName: targetUser.contactName,
                click_action: 'FLUTTER_NOTIFICATION_CLICK'
              }
            );
            console.log('Notification sent successfully:', notificationResponse);
          } catch (notificationError) {
            console.error('Error sending notification:', notificationError);
            // Log the error but don't fail the request
          }
        } else {
          console.warn('No FCM token available for user:', targetUser.contactName);
        }
        
        Alert_comp("Success", "Friend request sent successfully!");
        find_friends();
      } else {
        Alert_comp("Error", res.data.message || "Failed to send friend request. Please try again.");
      }
    } catch (err) {
      console.error('Error sending friend request:', err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to send friend request. Please try again.";
      Alert_comp("Error", errorMessage);
    }
  };

  const unsend_request = (user_id) => {
    unsend_request_api(user_id, token)
      .then((res) => {
        if (res.data.status) {
          // setmodalVisible(false);
          find_friends();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(find_friends, [search_text]);

  return (
    <Modal_Comp
      modalVisible={modalVisible}
      setModalVisible={setmodalVisible}
      label={"Find Friends"}
    >
      <View
        style={{
          padding: 10,
          height: 400,
        }}
      >
        <Form_Item
          value={search_text}
          onchange={(e) => {
            setsearch_text(e);
          }}
          placeholder={"Enter text here.."}
        />
        {filtred_arr?.length > 0 && (
          <FlatList
            style={{
              width: "100%",
            }}
            contentContainerStyle={{
              width: "100%",
              marginTop: 10,
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={filtred_arr}
            renderItem={({ item, index }) => {
              return (
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
                      justifyContent: "start",
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
                        {getUserInitials(item?.contactName)}
                      </Text>
                    </Flex_Box>
                    <Text
                      style={{
                        color: text_color,
                        fontWeight: 500,
                        fontSize: 16,
                      }}
                    >
                      {item?.contactName}
                    </Text>
                  </Flex_Box>
                  {item?.requestStatus == "accepted" && (
                    <TouchableOpacity
                      onPress={() => {
                        setmodalVisible(false);
                        navigation?.navigate("ChatScreen", {
                          contact: item,
                        });
                      }}
                    >
                      <Flex_Box
                        style={{
                          width: "",
                          borderRadius: 50,
                          padding: 10,
                          backgroundColor: "#000",
                        }}
                      >
                        <FontAwesome6 name="message" size={15} color="#fff" />
                      </Flex_Box>
                    </TouchableOpacity>
                  )}
                  {item?.requestStatus == "pendingApproval" && (
                    <TouchableOpacity
                    onPress={() => {
                      unsend_request(item.id);
                    }}
                  >
                      <Flex_Box
                        style={{
                          width: "",
                          borderRadius: 50,
                          padding: 10,
                          paddingHorizontal: 12,
                          backgroundColor: "#000",
                        }}
                      >
                        <FontAwesome6 name="hourglass" size={15} color="#fff" />
                      </Flex_Box>
                      </TouchableOpacity>
                  )}
                  {item?.requestStatus == "available" && (
                    <TouchableOpacity
                      onPress={() => {
                        send_request(item.id);
                      }}
                    >
                      <Flex_Box
                        style={{
                          width: "",
                          borderRadius: 50,
                          padding: 10,
                          backgroundColor: "#000",
                        }}
                      >
                        <FontAwesome6 name="user-plus" size={15} color="#fff" />
                      </Flex_Box>
                    </TouchableOpacity>
                  )}
                </Flex_Box>
              );
            }}
          />
        )}
      </View>
    </Modal_Comp>
  );
};

export default SearchContacts;
