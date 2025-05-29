import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Touchable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Sidebar_Toggle_Bar } from "../../Sidebar/Sidebar_Toggle";
import { light_theme, theme_color } from "../../../utilities/colors";
import Form_Item from "../../../utilities/Form_Item";
import Flex_Box from "../../../utilities/Flex_Box";
import { useIsFocused } from "@react-navigation/native";
import {
  get_states_api,
  send_suggestion_api,
  upd_user_details_api,
} from "../../../apis";
import return_error from "../../../utilities/Return_Error";
import { useDispatch, useSelector } from "react-redux";
import Button_Comp from "../../../utilities/Button_Comp";
import Alert_comp from "../../../utilities/Alert_comp";
import { set_user_action } from "../../../redux_prog/actions/auth_action";
import { set_loading_action } from "../../../redux_prog/actions/base_action";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Img_Picker from "../../../utilities/Img_Picker";
import BottomBar from "../../BottomBar";

const Suggestions = ({ navigation }) => {
  const { backgroundColor, text_color, grey, dark_grey } = light_theme;
  const { token } = useSelector((state) => state?.authReducer);
  const { is_loading } = useSelector((state) => state?.baseReducer);

  const dispatch = useDispatch();

  const [suggestion_data, setsuggestion_data] = useState({ images: [] });

  const { description, images, topic } = suggestion_data;

  const upd_suggestion_data = (val_obj) => {
    setsuggestion_data({
      ...suggestion_data,
      ...val_obj,
    });
  };

  const send_suggestion = () => {
    dispatch(set_loading_action(true));
    send_suggestion_api(suggestion_data, token)
      .then((res) => {
        dispatch(set_loading_action(false));
        if (res.data?.status == true) {
          Alert_comp("Success", "Suggestion added successfully!");
          setsuggestion_data({});
        }
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.error(return_error(err));
        Alert_comp("Error", return_error(err));
      });
  };

  return (
    <>
      <Sidebar_Toggle_Bar
        func={() => {
          navigation.goBack();
        }}
        sub_route={true}
        label={"Account"}
      />
      <View
        style={{
          flex: 1,
          backgroundColor,
          paddingBottom: 60,
        }}
      >
        <ScrollView
          style={{
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: text_color,
            }}
          >
            Suggestions
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: grey,
            }}
          >
            Send us a feedback and screenshots
          </Text>
          <Form_Item
            style={{
              marginTop: 10,
            }}
            label={"Enter a topic"}
            value={topic}
            onchange={(e) => {
              upd_suggestion_data({
                topic: e,
              });
            }}
          />
          <Form_Item
            style={{
              marginTop: 10,
            }}
            input_style={{
              height: 100,
            }}
            label={"How can we help you?"}
            value={description}
            onchange={(e) => {
              upd_suggestion_data({
                description: e,
              });
            }}
          />
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "start",
              gap: 15,
              flexWrap: "wrap",
              marginTop: 10,
            }}
          >
            {images?.length > 0 &&
              images?.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      position: "relative",
                      width: 65,
                    }}
                  >
                    <Image
                      style={{
                        height: 65,
                        width: 65,
                      }}
                      source={{ uri: item }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        upd_suggestion_data({
                          images: images?.filter((el) => {
                            return el != item;
                          }),
                        });
                      }}
                      style={{
                        position: "absolute",
                        right: -5,
                        top: -13,
                        zIndex: 1000,
                      }}
                    >
                      <Text
                        style={{
                          color: text_color,
                          fontSize: 18,
                        }}
                      >
                        &times;
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            <Img_Picker
              onChange={(base64) => {
                upd_suggestion_data({
                  images: [base64, ...images],
                });
              }}
            />
          </Flex_Box>

          <Button_Comp
            label={"Send"}
            btn_style={{
              paddingVertical: 14,
              marginTop: 10,
            }}
            onClick={send_suggestion}
            loading={is_loading}
          />
        </ScrollView>
      </View>
      <BottomBar navigation={navigation} />
    </>
  );
};

export default Suggestions;
