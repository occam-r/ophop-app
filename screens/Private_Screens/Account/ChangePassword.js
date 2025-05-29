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
  update_password_api,
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

const Change_Password = ({ navigation }) => {
  const { backgroundColor, text_color, grey, dark_grey } = light_theme;
  const { token } = useSelector((state) => state?.authReducer);
  const { is_loading } = useSelector((state) => state?.baseReducer);

  const dispatch = useDispatch();

  const [pass_data, setpass_data] = useState({});

  const { currentPassword, newPassword, rnewPassword } = pass_data;

  const upd_pass_data = (val_obj) => {
    setpass_data({
      ...pass_data,
      ...val_obj,
    });
  };

  const update_password = () => {
    if (currentPassword && newPassword && newPassword == rnewPassword) {
      dispatch(set_loading_action(true));
      update_password_api({ currentPassword, newPassword }, token)
        .then((res) => {
          dispatch(set_loading_action(false));
          if (res.data?.status == true) {
            Alert_comp("Success", "Suggestion added successfully!");
            setpass_data({});
          }
        })
        .catch((err) => {
          dispatch(set_loading_action(false));
          console.error(return_error(err));
          Alert_comp("Error", return_error(err));
        });
    } else {
      Alert_comp("Error", "Invalid Password");
    }
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
            Change Password
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: grey,
            }}
          >
            Create you password with min 6 characters
          </Text>
          <Form_Item
            style={{
              marginTop: 10,
            }}
            label={"Old Password"}
            value={currentPassword}
            onchange={(e) => {
              upd_pass_data({
                currentPassword: e,
              });
            }}
          />
          <Form_Item
            style={{
              marginTop: 10,
            }}
            label={"New Password"}
            value={newPassword}
            onchange={(e) => {
              upd_pass_data({
                newPassword: e,
              });
            }}
          />
          <Form_Item
            style={{
              marginTop: 10,
            }}
            label={"Repeat New Password"}
            value={rnewPassword}
            onchange={(e) => {
              upd_pass_data({
                rnewPassword: e,
              });
            }}
          />

          <Button_Comp
            label={"Change Password"}
            btn_style={{
              paddingVertical: 14,
              marginTop: 10,
            }}
            onClick={update_password}
            loading={is_loading}
          />
        </ScrollView>
      </View>
      <BottomBar navigation={navigation} />
      </>
  );
};

export default Change_Password;
