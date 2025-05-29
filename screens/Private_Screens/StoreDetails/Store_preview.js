import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { Sidebar_Toggle } from "../../Sidebar/Sidebar_Toggle";
import Scroll_Comp from "../../../utilities/Scroll_Comp";
import Flex_Box from "../../../utilities/Flex_Box";
import { light_theme, theme_color } from "../../../utilities/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import {
  formatDistance,
  getDistanceBetweenTwoPoints,
  openGoogleMapsNavigation,
} from "../../../utilities/Map_utils";
import { IMG_BASE_URL, STORAGE_URL } from "../../../apis/config";
import Button_Comp from "../../../utilities/Button_Comp";
import { set_routes_action } from "../../../redux_prog/actions/auth_action";
import {
  actions_api,
  add_fav_shop_api,
  share_to_notes_api,
  subscribe_store_api,
} from "../../../apis";
import {
  set_loading_action,
  set_nearby_shops_action,
} from "../../../redux_prog/actions/base_action";
import Fav_Modal from "../../../utilities/Fav_Modal";
import Alert_comp from "../../../utilities/Alert_comp";
import return_error from "../../../utilities/Return_Error";
import Share_Modal from "./Share_Modal";
import Report_Modal from "./Report_Modal";
import { isShopOpen } from "../../../utilities/utilities";
import { get_meridian_time } from "../../../utilities/Get_Meridian_Time";
import { Weekdays } from "../../../utilities/WeekDays";
import Share from 'react-native-share';

const Store_preview = ({ navigation, store_details, setstore_details }) => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const { current_location, nearby_shops } = useSelector(
    (state) => state?.baseReducer
  );
  const { longitude, latitude } = current_location;
  const { routes, token } = useSelector((state) => state?.authReducer);

  const {
    text_color,
    grey,
    green,
    backgroundColor,
    light_grey,
    dark_grey,
    red,
    light_red,
  } = light_theme;

  const shop_data =
    nearby_shops?.filter((el) => {
      return el?.id == route?.params?.id;
    })[0] || {};

  const additional_shop_data = { ...store_details, ...shop_data };

  // console.warn(additional_shop_data);

  const my_hop_data =
    routes?.filter((el) => {
      return el?.id == route?.params?.id;
    })[0] || {};

  const { storeName, location } = additional_shop_data || {};

  const togglemyroutes = () => {
    if (my_hop_data?.id) {
      dispatch(
        set_routes_action(
          routes?.filter((el) => {
            return el?.id != route?.params?.id;
          })
        )
      );
    } else {
      if (routes?.length > 0) {
        dispatch(set_routes_action([additional_shop_data, ...routes]));
      } else {
        dispatch(set_routes_action([additional_shop_data]));
      }
    }
  };

  const toggle_fav = async (id, data) => {
    try {
      dispatch(set_loading_action(true));
      const res = await add_fav_shop_api(id, data, token);
      if (res.data.status == true) {
        dispatch(set_loading_action(false));
        dispatch(
          set_nearby_shops_action(
            nearby_shops.map((el) => {
              if (el?.id == id) {
                return {
                  ...el,
                  isFavorite: data.isFavorite,
                };
              } else {
                return el;
              }
            })
          )
        );
      }
    } catch (error) {
      dispatch(set_loading_action(false));
      console.error(error);
    }
  };

  const toggle_Subscribe = async (id, data) => {
    try {
      dispatch(set_loading_action(true));
      const res = await subscribe_store_api(id, data, token);
      if (res.data.status == true) {
        console.warn({ id, data, token });
        dispatch(set_loading_action(false));
        dispatch(
          set_nearby_shops_action(
            nearby_shops.map((el) => {
              if (el?.id == id) {
                return {
                  ...el,
                  isSubscribed: data.isSubscribed,
                };
              } else {
                return el;
              }
            })
          )
        );
      }
    } catch (error) {
      dispatch(set_loading_action(false));
      console.error(error);
    }
  };

  const share_to_notes = () => {
    dispatch(set_loading_action(true));
    share_to_notes_api(
      {
        message: "",
        shopId: route?.params?.id,
      },
      token
    )
      .then((res) => {
        dispatch(set_loading_action(false));
        if (res.data.status == true) {
          Alert_comp("Success", "Store added to notes");
        }
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.error(return_error(err));
      });
  };

  const shop_open =
    !store_details?.isHoliday && isShopOpen(store_details?.schedule);

  const today = new Date();
  const weekday = Object.keys(Weekdays)?.filter((el, index) => {
    return index + 1 == today.getDay() + 1;
  })[0];

  const open_time = store_details?.schedule
    ? get_meridian_time(store_details?.schedule[weekday]?.open)
    : "";
  const open_hrs = open_time ? new Date(open_time)?.getHours() - 7 : "";
  const open_mins = open_time ? new Date(open_time)?.getMinutes() + 30 : "";
  const open_hours =
    open_mins >= 30
      ? open_hrs > 0
        ? open_hrs - 1
        : open_hrs + 11
      : open_hrs > 0
      ? open_hrs
      : open_hrs + 12;
  const open_minutes = open_mins == 60 ? "" : ":" + open_mins;
  const opening_time = open_hours + open_minutes;

  // console.warn(open_time);
  const [profile_view_updated, setprofile_view_updated] = useState(false)

  const profile_view = async () => {
    if(additional_shop_data?.id
      // && profile_view_updated == false
    )
    {
    try {
      await actions_api(
        {
          actionId: 1,
          shopId: additional_shop_data?.id,
        },
        token
      );
      setprofile_view_updated(true);
    } catch (error) {
      console.error(error);
    }
  }
  };

  useEffect(() => {
    profile_view();
  }, [isFocused]);

  // useEffect(() => {
  // setprofile_view_updated(false);
  // }, [isFocused])
  

  // console.warn(JSON.stringify(additional_shop_data?.isChatEnabled));
  

  const shareToFacebook = async () => {
    try {
      const shareOptions = {
        title: 'Share Store',
        message: `Check out ${storeName} on OpHop!`,
        url: `https://ophop.com/store/${route?.params?.id}`,
        social: Share.Social.FACEBOOK
      };
      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      Alert_comp("Error", "Failed to share to Facebook");
    }
  };

  const shareToInstagram = async () => {
    try {
      const shareOptions = {
        title: 'Share Store',
        message: `Check out ${storeName} on OpHop!`,
        url: `https://ophop.com/store/${route?.params?.id}`,
        social: Share.Social.INSTAGRAM,
        whatsAppNumber: "", // WhatsApp number
        filename: 'test', // only for base64 file in Android
        backgroundImage: STORAGE_URL + additional_shop_data?.logotype, // only for base64 file in Android
        backgroundImageScale: 1, // only for base64 file in Android
        isNewTask: true, // Android only
        forceDialog: true, // Android only
        saveToFiles: true, // iOS only
      };
      
      const ShareResponse = await Share.shareSingle(shareOptions);
      console.log('Share Response:', ShareResponse);
    } catch (error) {
      console.error('Error sharing to Instagram:', error);
      Alert_comp("Error", "Failed to share to Instagram. Please make sure Instagram is installed.");
    }
  };

  return (
    <>
      <Flex_Box
        style={{
          flexDirection: "row",
          justifyContent: "start",
          gap: 10,
          marginLeft: 30,
        }}
      >
        <Flex_Box
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#c9c9c9",
            borderRadius: 50,
            height: 60,
            width: 60,
            position: "relative",
          }}
        >
          <Sidebar_Toggle
            style={{
              top: 3,
              left: -40,
            }}
            sub_route={true}
            func={() => {
              navigation.goBack();
            }}
          />
          {additional_shop_data?.logotype ? (
            <Image
              source={{ uri: STORAGE_URL + additional_shop_data?.logotype }}
              style={{
                height: 25,
                width: 25,
              }}
            />
          ) : (
            <FontAwesome6 name="shop" size={20} color="#c9c9c9" />
          )}
        </Flex_Box>

        <View>
          <Text
            style={{
              color: text_color,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {storeName}
          </Text>
          <Text
            style={{
              color: grey,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {location?.displayAddress}
          </Text>
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "start",
              gap: 10,
              marginTop: 4,
            }}
          >
            <Flex_Box
              style={{
                flexDirection: "row",
                gap: 3,
                width: "",
              }}
            >
              <FontAwesome6 name="star" size={15} color="gold" />
              <Text style={{ color: text_color }}>
                {additional_shop_data?.rating}
              </Text>
            </Flex_Box>
            <Flex_Box
              style={{
                flexDirection: "row",
                gap: 3,
                width: "",
              }}
            >
              <FontAwesome name="send" size={15} color="#c9c9c9" />
              <Text
                style={{
                  color: text_color,
                }}
              >
                {formatDistance(
                  getDistanceBetweenTwoPoints(
                    {
                      lat: parseFloat(additional_shop_data?.location?.lat),
                      lng: parseFloat(additional_shop_data?.location?.lng),
                    },
                    {
                      lat: parseFloat(latitude),
                      lng: parseFloat(longitude),
                    }
                  )
                )}
              </Text>
            </Flex_Box>
          </Flex_Box>
        </View>
      </Flex_Box>

      <Flex_Box
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          paddingTop: 15,
          // paddingBottom: 5,
        }}
      >
        {/* (!shopData.isHoliday && isShopOpen(shopData.schedule)) */}
        <Button_Comp
          btn_style={{
            backgroundColor: shop_open ? backgroundColor : light_red,
            width: "",
            paddingVertical: 8,
            paddingLeft: shop_open ? 8 : 0,
            paddingHorizontal: 15,
          }}
          text_style={{
            color: shop_open ? green : red,
            fontSize: 16,
          }}
          label={shop_open ? "Open Now" : "Opens: Tomorrow " + open_time}
        />
        <Report_Modal additional_shop_data={additional_shop_data} />
      </Flex_Box>

      <Flex_Box
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          paddingVertical: 10,
          flexWrap: "wrap",
          gap: 10,
          paddingHorizontal: 20,
        }}
      >
        <Button_Comp
          onClick={togglemyroutes}
          label={my_hop_data?.id ? "Added" : "Add to my hop"}
          text_style={{
            color: theme_color,
            fontSize: 12,
          }}
          btn_style={{
            backgroundColor: "#fff",
            paddingVertical: 1,
            height: 40,
            borderRadius: 10,
            borderColor: "#c9c9c9",
            borderWidth: 1,
            width: "48%",
          }}
        />
        <Button_Comp
          label="Go Now"
          text_style={{
            fontSize: 12,
          }}
          btn_style={{
            paddingVertical: 1,
            height: 40,
            borderRadius: 10,
            width: "48%",
          }}
          onClick={async () => {
            await actions_api(
              {
                actionId: 3,
                shopId: additional_shop_data?.id,
              },
              token
            );
            openGoogleMapsNavigation(
              additional_shop_data?.location?.lat,
              additional_shop_data?.location?.lng
            );
          }}
        />

        <Fav_Modal
          toggle_fav={toggle_fav}
          additional_shop_data={additional_shop_data}
        />

        <Button_Comp
          btn_style={{
            backgroundColor: additional_shop_data?.isSubscribed
              ? "pink"
              : backgroundColor,
            paddingVertical: 1,
            height: 40,
            borderRadius: 10,
            width: "48%",
            borderColor: light_grey,
            borderWidth: 1,
          }}
          text_style={{
            color: additional_shop_data?.isSubscribed ? "#fff" : dark_grey,
          }}
          label={
            additional_shop_data?.isSubscribed ? "Unsubscribe" : "Subscribe"
          }
          onClick={() => {
            toggle_Subscribe(additional_shop_data?.id, {
              isSubscribed: additional_shop_data?.isSubscribed ? false : true,
            });
          }}
        />

        <Share_Modal additional_shop_data={additional_shop_data} />

        <Button_Comp
          btn_style={{
            backgroundColor,
            paddingVertical: 1,
            height: 40,
            borderRadius: 10,
            width: "48%",
            borderColor: theme_color,
            borderWidth: 1,
          }}
          text_style={{
            color: theme_color,
          }}
          label={"Share to notes"}
          onClick={share_to_notes}
        />

        <Button_Comp
          btn_style={{
            backgroundColor: "#1877F2", // Facebook blue
            paddingVertical: 1,
            height: 40,
            borderRadius: 10,
            width: "48%",
          }}
          text_style={{
            color: "#fff",
          }}
          label={"Share on Facebook"}
          onClick={shareToFacebook}
        />

        <Button_Comp
          btn_style={{
            backgroundColor: "#E4405F", // Instagram pink
            paddingVertical: 1,
            height: 40,
            borderRadius: 10,
            width: "48%",
          }}
          text_style={{
            color: "#fff",
          }}
          label={"Share on Instagram"}
          onClick={shareToInstagram}
        />
      </Flex_Box>
    </>
  );
};

export default Store_preview;
