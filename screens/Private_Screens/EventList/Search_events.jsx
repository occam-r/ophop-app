import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Flex_Box from "../../../utilities/Flex_Box";
import { getUserInitials } from "../../../utilities/utilities";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { light_theme } from "../../../utilities/colors";
import Form_Item from "../../../utilities/Form_Item";
import Modal_Comp from "../../../utilities/Modal_Comp";
import { find_users_api, sendRequest_api } from "../../../apis";
import AntDesign from "react-native-vector-icons/AntDesign";

const Search_events = ({ navigation, modalVisible, setmodalVisible,setsearch_text }) => {
  const { contacts } = useSelector((state) => state?.baseReducer);
  const { token } = useSelector((state) => state?.authReducer);
  const { text_color, grey } = light_theme;

//   const [search_text, setsearch_text] = useState("");
  const [filtred_arr, setfiltred_arr] = useState([]);

//   const find_friends = () => {
    
//   };



//   useEffect(find_friends, [search_text]);

  return (
    <Modal_Comp
      modalVisible={modalVisible}
      setModalVisible={setmodalVisible}
      label={"Search Events"}
    >
      <View
        style={{
          padding: 10,
          height: 400,
        }}
      >
        <Form_Item
        //   value={search_text}
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
                  )}
                  {item?.requestStatus == "available" && (
                    <TouchableOpacity
                      onPress={() => {
                        // send_request(item.id);
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

export default Search_events;
