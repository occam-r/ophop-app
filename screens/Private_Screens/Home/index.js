import React, { useEffect, useState } from "react";
import Flex_Box from "../../../utilities/Flex_Box";
import { Alert, Image, Text, View } from "react-native";
import Scroll_Comp from "../../../utilities/Scroll_Comp";
import { light_theme, theme_color } from "../../../utilities/colors";
import SearchBar from "../../../utilities/SearchBar";
import Categories from "./Categories";
import Shop_Nearby from "./Shop_Nearby";
import Subscribed_store_posts from "./Subscribed_store_posts";
import { Sidebar_Toggle } from "../../Sidebar/Sidebar_Toggle";
import Select_Modal from "../../../utilities/Select_Box";
import { useDispatch, useSelector } from "react-redux";
import {
  getCity_api,
  get_city_data_api,
  get_city_details_api,
  get_contacts_api,
} from "../../../apis";
import return_error from "../../../utilities/Return_Error";
const { backgroundColor } = light_theme;
import GetLocation from "react-native-get-location";
import {
  set_city_action,
  set_city_details_action,
  set_contacts_action,
  set_location_action,
} from "../../../redux_prog/actions/base_action";
import { useIsFocused } from "@react-navigation/native";
import BottomBar from "../../BottomBar";
import OPSVG from "../../../images/ophoplogo.svg";
import { set_auth_location_action } from "../../../redux_prog/actions/auth_action";

const Home = ({ navigation }) => {
  const IsFocused = useIsFocused();
  const authReducer = useSelector((state) => state?.authReducer);
  const { token } = authReducer;
  const dispatch = useDispatch();
  const { city_data,city_details,network_on } = useSelector((state) => state?.baseReducer);
  const { cityName, id } = city_details?.city_data || {};

  useEffect(() => {
    {!network_on &&
      Alert.alert(
        `You appear to be offline. Updated details won't be available`
      )}
  }, [network_on])
  

  const get_city = () => {
    getCity_api(token)
      .then((res) => {
        dispatch(set_city_action(res.data.data.cities));
        if(!id){
          // dispatch(set_city_details_action({
          //   city_data:res.data.data.cities[0]
          // }));
        get_city_details(res.data.data.cities[0]?.id,{city_data:res.data.data.cities[0]});
        }
      })
      .catch((err) => {
        console.error(err?.response);
      });
  };

  const get_contacts = () => {
    get_contacts_api(token)
      .then((res) => {
        dispatch(set_contacts_action(res.data.data.contacts));
        console.warn(res.data);
      })
      .catch((err) => {
        console.error(return_error(err));
      });
  };

  const get_city_details = (id, c_details) => {
    get_city_details_api(id, token)
      .then((res) => {
        console.log("City Details API Response:", JSON.stringify(res.data.data, null, 2));
        const c_obj = c_details || {};
        dispatch(set_city_details_action({
          city_data: c_obj,
          ...res.data.data
        }));
      })
      .catch((err) => {
        console.error("City Details API Error:", return_error(err));
      });
  };

  useEffect(() => {
    get_city();
    get_contacts();

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then((location) => {
        dispatch(
          set_location_action({
            latitude: location.latitude,
            longitude: location.longitude,
          })
        );
        dispatch(
          set_auth_location_action({
            latitude: location.latitude,
            longitude: location.longitude,
          })
        );
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
      });
  }, [IsFocused]);

  const { grey, text_color } = light_theme;

  // console.warn("=====>"+JSON.stringify(city_details?.city_data));
  

  return (
    <>
      <Scroll_Comp
        view_style={{
          paddingTop: 20,
          paddingBottom: 60,
          paddingHorizontal: 10,
          // position:"relative"
        }}
      >
        <Text
          style={{
            fontWeight: 600,
            fontSize: 24,
            color: text_color,
            marginTop: 105,
          }}
        >
          Explore
        </Text>
        <Categories token={token} navigation={navigation} />
        <Shop_Nearby navigation={navigation} city_id={city_details?.city_data?.city_data?.id} token={token} />
        <Subscribed_store_posts navigation={navigation} />
      </Scroll_Comp>
      <BottomBar navigation={navigation} />
      <View
        style={{
          position: "absolute",
          top: 0,
          backgroundColor,
          padding: 12,
          paddingBottom: 0,
        }}
      >
        <Flex_Box
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            // paddingLeft: 40,
          }}
        >
          {/* <Text
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: theme_color,
            }}
          >
            OpHop.
          </Text> */}
          <View
            style={{
              marginTop: 10,
            }}
          >
            <OPSVG />
          </View>
          <Flex_Box
            style={{
              width: "",
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../../../images/location_icon.png")}
              style={{
                height: 20,
                width: 20,
              }}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: theme_color,
              }}
            >
              {cityName}
            </Text>
          </Flex_Box>
        </Flex_Box>
        <SearchBar label={"Search in " + cityName} navigation={navigation} />
        {/* <Select/> */}
      </View>
    </>
  );
};

export default Home;
