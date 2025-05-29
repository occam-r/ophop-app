import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { light_theme, theme_color } from "../../../../../utilities/colors";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { set_loading_action } from "../../../../../redux_prog/actions/base_action";
import return_error from "../../../../../utilities/Return_Error";
// import Add_Volunteers_Modal from "./Add_Volunteer_Modal";
import { get_holidays_api } from "../../../../../apis";
import Flex_Box from "../../../../../utilities/Flex_Box";
import { formatPostDeadline } from "../../../../../utilities/Get_Meridian_Time";
import { screen_height } from "../../../../../utilities/utilities";

const Holidays = ({ navigation, token, tab_index }) => {
  const { text_color, green, dark_grey, light_grey, grey, pink } = light_theme;

  const isfocused = useIsFocused();
  const dispatch = useDispatch();
  const { params } = useRoute();

  const [holidays, setholidays] = useState([]);

  const get_holidays = () => {
    // if (tab_index == 8) {
      dispatch(set_loading_action(true));
      get_holidays_api(params?.id, 0, 10, token)
        .then((res) => {
          dispatch(set_loading_action(false));
          console.warn(res.data);
          setholidays([...res.data?.data?.shopHolidays]);
        })
        .catch((err) => {
          dispatch(set_loading_action(false));
          console.error(return_error(err));
        });
    // }
  };

  useEffect(get_holidays, [isfocused, tab_index]);

  return (
    <>
      <View
        style={{
          // height: 390,
          flex: 1,
        }}
      >
        <View
          style={{
            paddingBottom: 8,
          }}
        >
          {holidays?.length > 0 && (
            <FlatList
              data={holidays}
              renderItem={({ item, index }) => {
                return (
                  <Flex_Box
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
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
                    <Flex_Box
                      style={{
                        marginTop: 5,
                        backgroundColor: light_grey,
                        borderRadius: 5,
                        padding: 5,
                        // width: "",
                        justifyContent: "start",
                      }}
                    >
                      <Text
                        style={{
                          color: pink,
                          fontWeight: 500,
                        }}
                      >
                        {formatPostDeadline(item?.dateFrom, item?.dateTo)}
                      </Text>
                    </Flex_Box>
                  </Flex_Box>
                );
              }}
            />
          )}
          {
            holidays?.length == 0 &&
            <Text
            style={{
              color:"#000",
              textAlign:"center"
            }}
            >
              Nothing to show here at the moment
            </Text>
           }
        </View>
      </View>
    </>
  );
};

export default Holidays;
