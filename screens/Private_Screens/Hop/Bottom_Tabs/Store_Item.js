import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { light_theme, theme_color } from "../../../../utilities/colors";
import Flex_Box from "../../../../utilities/Flex_Box";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Button_Comp from "../../../../utilities/Button_Comp";
import { useDispatch, useSelector } from "react-redux";
import { set_routes_action } from "../../../../redux_prog/actions/auth_action";
import {
  formatDistance,
  getDistanceBetweenTwoPoints,
  openGoogleMapsNavigation,
} from "../../../../utilities/Map_utils";
import {
  set_loading_action,
  set_nearby_shops_action,
} from "../../../../redux_prog/actions/base_action";
import { add_fav_shop_api } from "../../../../apis";
import Fav_Modal from "../../../../utilities/Fav_Modal";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Shop_Img from "../../../../utilities/Shop_Img";

const Store_Item = ({
  item,
  my_hop,
  isclosest,
  navigation,
  setroute_shop,
  route_preview,
}) => {
  const { grey, backgroundColor, text_color, light_grey } = light_theme;
  const { current_location } = useSelector((state) => state?.baseReducer);
  const { longitude, latitude } = current_location;

  const { routes, token } = useSelector((state) => state?.authReducer);
  const { nearby_shops } = useSelector((state) => state?.baseReducer);
  const dispatch = useDispatch();

  const togglemyroutes = () => {
    console.warn({ routes, item });

    if (my_hop) {
      dispatch(
        set_routes_action(
          routes?.filter((el) => {
            return el?._id != item?._id;
          })
        )
      );
    } else {
      if (routes?.length > 0) {
        dispatch(set_routes_action([item, ...routes]));
      } else {
        dispatch(set_routes_action([item]));
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

  return (
    <View
      style={{
        borderRadius: 10,
        borderColor: route_preview ? "#fff" : grey,
        borderWidth: 1,
        padding: 8,
        marginTop: 10,
        position: "relative",
      }}
    >
      {!route_preview && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex:1000
          }}
          onPress={() => {
            setroute_shop(item);
          }}
        >
          <FontAwesome5 name="directions" color={grey} size={20} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          navigation?.navigate("Store Details", {
            id: item?.id,
          });
        }}
      >
        <Flex_Box
          style={{
            flexDirection: "row",
            gap: 5,
            justifyContent: "start",
          }}
        >
          <Shop_Img
            img={item?.logotype}
            func={() => {
              navigation?.navigate("Store Details", {
                id: item?.id,
              });
            }}
          />
          <View>
            <View
              style={{
                width: "90%",
                flexWrap: "wrap",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: text_color,
                }}
              >
                {item?.storeName}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: grey,
                marginTop: 2,
              }}
            >
              {item?.location?.address?.length > 26
                ? item?.location?.address?.slice(0, 26) + ".."
                : item?.location?.address}
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
                <Text style={{ color: text_color }}>{item?.rating}</Text>
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
                        lat: parseFloat(item?.location?.lat),
                        lng: parseFloat(item?.location?.lng),
                      },
                      {
                        lat: parseFloat(latitude),
                        lng: parseFloat(longitude),
                      }
                    )
                  )}
                </Text>
              </Flex_Box>
              <Text
                style={{
                  color: "green",
                }}
              >
                {item?.lastVisited}
              </Text>
              {isclosest && (
                <Flex_Box
                  style={{
                    backgroundColor: "green",
                    width: 70,
                    borderRadius: 30,
                    paddingHorizontal: 10,
                    paddingBottom: 1,
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <FontAwesome6 name="circle-user" size={10} color="#fff" />
                  <Text
                    style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}
                  >
                    Closest
                  </Text>
                </Flex_Box>
              )}
            </Flex_Box>
          </View>
        </Flex_Box>
      </TouchableOpacity>
      <Flex_Box
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          marginTop: 10,
        }}
      >
        {!route_preview && (
          <Button_Comp
            onClick={togglemyroutes}
            label={my_hop ? "Added" : "Add to my hop"}
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
              width: "45%",
            }}
          />
        )}

        <Button_Comp
          label="Go Now"
          text_style={{
            fontSize: 12,
          }}
          btn_style={{
            paddingVertical: 1,
            height: 40,
            borderRadius: 10,
            width: route_preview ? "100%" : "45%",
          }}
          onClick={() => {
            openGoogleMapsNavigation(item?.location?.lat, item?.location?.lng);
          }}
        />
      </Flex_Box>
      {!route_preview && (
        <Fav_Modal
          style={{
            width: "100%",
          }}
          toggle_fav={toggle_fav}
          additional_shop_data={item}
        />
      )}
    </View>
  );
};

export default Store_Item;
