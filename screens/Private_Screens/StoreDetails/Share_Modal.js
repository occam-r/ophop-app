import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { light_theme, theme_color } from "../../../utilities/colors";
import Flex_Box from "../../../utilities/Flex_Box";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Button_Comp from "../../../utilities/Button_Comp";
import Modal_Comp from "../../../utilities/Modal_Comp";
import { useDispatch, useSelector } from "react-redux";
import { getUserInitials } from "../../../utilities/utilities";
import { find_users_api, messages_api } from "../../../apis";
import Alert_comp from "../../../utilities/Alert_comp";
import { set_loading_action } from "../../../redux_prog/actions/base_action";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Form_Item from "../../../utilities/Form_Item";

const Share_Modal = ({ additional_shop_data }) => {
  const { text_color, grey, backgroundColor } = light_theme;
  const [modalVisible, setmodalVisible] = useState(false);
  const { contacts } = useSelector((state) => state?.baseReducer);
  const [filtered_arr, setfiltered_arr] = useState([]);
  const { token } = useSelector((state) => state?.authReducer);
  const [search_box, setsearch_box] = useState(false);
  const [search_text, setsearch_text] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  
  const dispatch = useDispatch();

  const toggleFriendSelection = (id) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((friend) => friend !== id) : [...prev, id]
    );
  };

  const share_func = async () => {
    try {
      dispatch(set_loading_action(true));
      await Promise.all(
        selectedFriends.map((id) =>
          messages_api(id, { message: "", shopId: additional_shop_data?.id }, token)
        )
      );
      dispatch(set_loading_action(false));
      Alert_comp("Success", "Successfully shared!");
      setmodalVisible(false);
      setSelectedFriends([]);
    } catch (error) {
      dispatch(set_loading_action(false));
      console.error(error);
    }
  };

  const find_friends = () => {
    if (search_text) {
      find_users_api(search_text, token)
        .then((res) => {
          setfiltered_arr(res.data?.data?.searchResults);
        })
        .catch((err) => console.error(err));
    } else {
      setfiltered_arr([]);
    }
  };

  useEffect(find_friends, [search_text]);

  return (
    <>
      <Button_Comp
        btn_style={{
          backgroundColor,
          justifyContent: "start",
          paddingVertical: 1,
          height: 40,
          borderRadius: 10,
          marginTop: 10,
          width: "48%",
          borderColor: theme_color,
          borderWidth: 1,
        }}
        onClick={() => setmodalVisible(true)}
        element={
          <Flex_Box style={{ gap: 10, flexDirection: "row" }}>
            <FontAwesome6 name="share" size={20} color={theme_color} />
            <Text style={{ fontWeight: 500, color: theme_color }}>Share</Text>
          </Flex_Box>
        }
      />
      <Modal_Comp modalVisible={modalVisible} setModalVisible={setmodalVisible} label={"Choose Friends"}>
        <View style={{ height: 400, width: '100%' }}>
          <ScrollView>
            <FlatList
              data={contacts}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleFriendSelection(item?.id)}>
                  <Flex_Box
                    style={{
                      width: '100%',
                      justifyContent: "space-between",
                      flexDirection: "row",
                      paddingHorizontal: 20,
                      borderBottomWidth: 1,
                      borderBottomColor: grey,
                      paddingVertical: 10,
                      alignItems : 'start'
                    
                      
                    }}
                  >
                    <Flex_Box style={{ flexDirection: "row", gap: 10, 
                    justifyContent: "start",
                      width:'40%' }}>
                      <Flex_Box style={{
                        backgroundColor: item?.avatarBackground,
                        borderRadius: 50,
                        height: 40,
                        width: 40,
                      }}>
                        <Text style={{ fontWeight: 600, fontSize: 18 }}>
                          {getUserInitials(item?.contactName)}
                        </Text>
                      </Flex_Box>
                      <Text style={{ color: text_color, fontWeight: 500, fontSize: 16 }}>
                        {item?.contactName}
                      </Text>
                    </Flex_Box>
                    <FontAwesome6
                      name={selectedFriends.includes(item?.id) ? "check-circle" : "circle"}
                      size={20}
                      color={selectedFriends.includes(item?.id) ? theme_color : "#000"}
                    />
                  </Flex_Box>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
          {selectedFriends.length > 0 && (
            <Button_Comp btn_style={{ marginTop: 10 }} onClick={share_func} element={<Text>Share</Text>} />
          )}
        </View>
      </Modal_Comp>
    </>
  );
};

export default Share_Modal;
