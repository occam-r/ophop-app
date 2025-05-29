import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Flex_Box from "../../../../../../utilities/Flex_Box";
import { light_theme, theme_color } from "../../../../../../utilities/colors";
import {
  formatPostDeadline,
  get_meridian_time,
} from "../../../../../../utilities/Get_Meridian_Time";
import { Weekdays } from "../../../../../../utilities/WeekDays";
import Bottom_Modal from "../../../../../../utilities/Bottom_Modal";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { set_loading_action } from "../../../../../../redux_prog/actions/base_action";
import {
  donations_api,
  get_store_posts_api,
  get_store_products_api,
  like_store_post_api,
  show_post_interest_api,
  volunteers_api,
} from "../../../../../../apis";
import Button_Comp from "../../../../../../utilities/Button_Comp";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import return_error from "../../../../../../utilities/Return_Error";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Form_Item from "../../../../../../utilities/Form_Item";
import { month_options } from "../../../../../../utilities/Month_options";
import { getYearList } from "../../../../../../utilities/Get_Years";
import validate_object from "../../../../../../utilities/Validate_object";
import Alert_comp from "../../../../../../utilities/Alert_comp";
import Add_Volunteers_Modal from "./Add_Volunteer_Modal";

const Volunteers = ({ navigation, token, volunteers, store_details }) => {
  const { text_color, green, dark_grey, light_grey, grey, pink } = light_theme;

  const isfocused = useIsFocused();
  const dispatch = useDispatch();
  const { params } = useRoute();

  const [open, setopen] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [submitting, setsubmitting] = useState(false);

  const [v_data, setv_data] = useState(volunteers);

  const [volunteer_data, setvolunteer_data] = useState({
    name: "",
    email: "",
    phone: "",
    shopId: params?.id,
  });

  const { name, email, phone, message } = volunteer_data;

  const add_volunteer = () => {
    setsubmitting(true);
    const is_validated = validate_object(volunteer_data);
    if (is_validated?.status == true) {
      volunteers_api(
        params?.id,
        { ...volunteer_data, message: message || "" },
        token
      )
        .then((res) => {
          setsubmitting(false);
          if (res.data.status == true) {
            Alert_comp("Success", "Created volunteer successfully!");
            setModalVisible(false);
            setv_data([res.data.data, ...v_data]);
          }
        })
        .catch((err) => {
          setsubmitting(false);
          console.error(return_error(err));
        });
    } else {
      console.error(is_validated);
    }
  };

  const upd_volunteer_data = (val_obj) => {
    setvolunteer_data({
      ...volunteer_data,
      ...val_obj,
    });
    setsubmitting(false);
  };

  return (
    <>
      <View>
        <Flex_Box
          style={{
            gap: 5,
            marginTop: 8,
          }}
        >
          {store_details?.volunteer_Title && (
            <Text
              style={{
                fontWeight: 600,
                color: text_color,
                fontSize: 16,
              }}
            >
              {store_details?.volunteer_Title}
            </Text>
          )}
          {store_details?.volunteer_Message && (
            <Text
              style={{
                fontWeight: 500,
                color: dark_grey,
                fontSize: 16,
              }}
            >
              {store_details?.volunteer_Message}
            </Text>
          )}

          <Button_Comp
            label={"Suggest A Volunteer"}
            btn_style={{
              borderColor: theme_color,
              borderWidth: 2,
              marginTop: 4,
              backgroundColor: "#FFF",
              paddingVertical: 10,
            }}
            text_style={{
              color: theme_color,
            }}
            onClick={() => {
              setModalVisible(true);
            }}
          />
        </Flex_Box>

        <View
          style={{
            // paddingBottom: 8,
            height: 270,
          }}
        >
          {v_data?.length > 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={v_data}
              renderItem={({ item, index }) => {
                return (
                  <Flex_Box
                    style={{
                      paddingVertical: 10,
                      justifyContent: "start",
                      alignItems: "start",
                      borderBottomWidth: 1,
                      borderBottomColor: grey,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: text_color,
                      }}
                    >
                      {item?.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: dark_grey,
                      }}
                    >
                      {item?.email}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: dark_grey,
                      }}
                    >
                      {item?.phone}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: dark_grey,
                      }}
                    >
                      {item?.message}
                    </Text>
                  </Flex_Box>
                );
              }}
            />
          )}
          {v_data?.length == 0 && (
            <Text
              style={{
                color: "#000",
                textAlign: "center",
              }}
            >
              Nothing to show here at the moment
            </Text>
          )}
        </View>
      </View>
      <Add_Volunteers_Modal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        label={"Add Volunteer"}
      >
        <Flex_Box
          style={{
            paddingHorizontal: 15,
            paddingTop: 15,
            paddingBottom: 5,
            gap: 20,
            // flex: 1,
          }}
        >
          <Form_Item
            value={name}
            onchange={(e) => {
              upd_volunteer_data({
                name: e,
              });
            }}
            label={"Name"}
            placeholder={"Enter name"}
            error={!name && submitting}
          />
          <Form_Item
            label={"Email"}
            value={email}
            onchange={(e) => {
              upd_volunteer_data({
                email: e,
              });
            }}
            placeholder={"Enter email"}
            error={!email && submitting}
          />
          <Form_Item
            label={"Phone"}
            placeholder={"Enter phone"}
            value={phone}
            onchange={(e) => {
              upd_volunteer_data({
                phone: e,
              });
            }}
            error={!phone && submitting}
          />
          <Form_Item
            label={"Meesage"}
            placeholder={"Enter Message"}
            value={message}
            onchange={(e) => {
              upd_volunteer_data({
                message: e,
              });
            }}
            input_style={{
              height: 100,
            }}
          />
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 20,
            }}
          >
            <Button_Comp
              label={"Save"}
              btn_style={{
                width: "",
                paddingVertical: 12,
                paddingHorizontal: 15,
                borderRadius: 5,
              }}
              loading={submitting}
              onClick={add_volunteer}
            />
            <Button_Comp
              label={"Cancel"}
              btn_style={{
                width: "",
                paddingVertical: 12,
                paddingHorizontal: 15,
                borderRadius: 5,
                backgroundColor: light_grey,
              }}
              text_style={{
                color: theme_color,
              }}
              onClick={() => {
                setModalVisible(false);
              }}
            />
          </Flex_Box>
        </Flex_Box>
      </Add_Volunteers_Modal>
    </>
  );
};

export default Volunteers;
