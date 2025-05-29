import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import Flex_Box from "../../../../utilities/Flex_Box";
import {
  getUserInitials,
  Not_Found_Text,
} from "../../../../utilities/utilities";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { light_theme } from "../../../../utilities/colors";

const ContactList = ({ navigation, setmodalVisible }) => {
  const { contacts } = useSelector((state) => state?.baseReducer);
  const { text_color, grey } = light_theme;

  return (
    <>
      {contacts?.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{
            width: "100%",
          }}
          contentContainerStyle={{
            width: "100%",
            // marginTop: 5,
          }}
          data={contacts}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation?.navigate("ChatScreen", {
                    contact: {
                      ...item,
                      room_id: item?.chatRoomId,
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
                  <Flex_Box
                    style={{
                      width: "",
                      borderRadius: 50,
                      padding: 10,
                      backgroundColor: "#fff",
                      borderColor: "#000",
                      borderWidth: 1,
                    }}
                  >
                    <FontAwesome6 name="message" size={15} color="#000" />
                  </Flex_Box>
                </Flex_Box>
              </TouchableOpacity>
            );
          }}
        />
      )}
      {contacts?.length == 0 && (
        <Not_Found_Text text={`You don't have any contacts!`} />
      )}
    </>
  );
};

export default ContactList;
