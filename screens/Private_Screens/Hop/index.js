import React, { useState } from "react";
import Map_comp from "./Map_comp";
import SearchBar from "../../../utilities/SearchBar";
import { Text, TouchableOpacity, View } from "react-native";
import Flex_Box from "../../../utilities/Flex_Box";
import Icon from "react-native-vector-icons/FontAwesome6";
import { light_theme, theme_color } from "../../../utilities/colors";
import { shadow_css } from "../../../utilities/Shadow_css";
import { useDispatch, useSelector } from "react-redux";
import GetLocation from "react-native-get-location";
import {
  set_loading_action,
  set_location_action,
} from "../../../redux_prog/actions/base_action";
import Bottom_Drawer from "../../../utilities/Bottom_Drawer";
import { Sidebar_Toggle } from "../../Sidebar/Sidebar_Toggle";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Bottom_Tabs from "./Bottom_Tabs";
import BottomBar from "../../BottomBar";
import { useRoute } from "@react-navigation/native";
import RoutePreview from "./Bottom_Tabs/RoutePreview";
import { set_auth_location_action } from "../../../redux_prog/actions/auth_action";

const Hop = ({ navigation }) => {
  const { backgroundColor, text_color, grey } = light_theme;
  const dispatch = useDispatch();
  const { city_data,current_location,city_details } = useSelector((state) => state?.baseReducer);
  const { cityName, id } = city_details?.city_data || {};
  const params = useRoute();
  const [route_shop, setroute_shop] = useState("");

  const directions_coords = route_shop
    ? {
        latitude: parseFloat(route_shop?.location.lat),
        longitude: parseFloat(route_shop?.location.lng),
      }
    : "";

  console.warn({ directions_coords,current_location });

  return (
    <>
      <Map_comp directions_coords={directions_coords} navigation={navigation} />
      <Flex_Box
        style={{
          flexDirection: "row",
          gap: 10,
          // paddingLeft: 0,
        }}
      >
        <SearchBar
          select_style={{
            width: "80%",
            backgroundColor,
            ...shadow_css,
          }}
          label={"Search in Melbourne"}
          navigation={navigation}
          tag={params?.params?.tag}
          tagName={params?.params?.tagName}
        />
        <TouchableOpacity
          style={{
            padding: 7,
            borderRadius: 50,
            backgroundColor,
            ...shadow_css,
          }}
          onPress={() => {
            dispatch(set_loading_action(true));
            GetLocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 60000,
            })
              .then((location) => {
                dispatch(set_loading_action(false));
                dispatch(
                  set_location_action({
                    latitude: location.latitude,
                    longitude: location.longitude,
                  })
                );
                dispatch(set_auth_location_action({
                  latitude: location.latitude,
                  longitude: location.longitude,
              }))
              })
              .catch((error) => {
                dispatch(set_loading_action(false));
                const { code, message } = error;
                console.warn(code, message);
              });
          }}
        >
          <Icon name="location-crosshairs" color={theme_color} size={22} />
        </TouchableOpacity>
      </Flex_Box>
      {!route_shop && (
        <Bottom_Drawer
          snap_points={["35%", "90%"]}
          label={
            <Flex_Box
              style={{
                gap: 5,
              }}
            >
              <Flex_Box
                style={{
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <FontAwesome name="map-marker" size={20} color={"#000"} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: text_color,
                  }}
                >
                  {cityName}
                </Text>
              </Flex_Box>
              <Text
                style={{
                  color: grey,
                  fontSize: 16,
                }}
              >
                Slide up to see stores in {cityName}
              </Text>
            </Flex_Box>
          }
        >
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "start",
              gap: 10,
            }}
          >
            <FontAwesome name="map-marker" size={20} color={"#000"} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: text_color,
              }}
            >
              {cityName}
            </Text>
          </Flex_Box>
          <Bottom_Tabs setroute_shop={setroute_shop} navigation={navigation} />
        </Bottom_Drawer>
      )}
      {route_shop && (
        <RoutePreview navigation={navigation} route_shop={route_shop} setroute_shop={setroute_shop} />
      )}
      <BottomBar navigation={navigation} />
    </>
  );
};

export default Hop;
