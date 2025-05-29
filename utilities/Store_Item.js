import { View, Text, TouchableOpacity, Alert, FlatList } from "react-native";
import React from "react";
import { light_theme, theme_color } from "./colors";
import Flex_Box from "./Flex_Box";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Button_Comp from "./Button_Comp";
import { useDispatch, useSelector } from "react-redux";
import { set_routes_action } from "../redux_prog/actions/auth_action";
import {
  formatDistance,
  getDistanceBetweenTwoPoints,
  openGoogleMapsNavigation,
} from "./Map_utils";
import {
  set_loading_action,
  set_nearby_shops_action,
} from "../redux_prog/actions/base_action";
import { add_fav_shop_api, subscribe_store_api } from "../apis";
import Fav_Modal from "./Fav_Modal";
import Shop_Img from "./Shop_Img";

const Store_Item = ({ item, isclosest, navigation, subscribe_btn, func }) => {
  const { grey, backgroundColor, text_color, dark_grey, light_grey } =
    light_theme;
  const { current_location } = useSelector((state) => state?.baseReducer);
  const { longitude, latitude } = current_location;

  const { routes, token } = useSelector((state) => state?.authReducer);
  const { nearby_shops, tags } = useSelector((state) => state?.baseReducer);
  const dispatch = useDispatch();

  const my_hop =
    routes?.filter((el) => {
      return el?.id == item?.id;
    })?.length > 0;

  const filtered_tags = tags?.filter((el) => {
    return item?.tags?.includes(el?.id);
  });

  const togglemyroutes = () => {
    // console.warn(filtered_tags);

    if (my_hop) {
      dispatch(
        set_routes_action(
          routes?.filter((el) => {
            return el?.id != item?.id;
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
        if (func) {
          func();
        }
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
        if (func) {
          func();
        }
      }
    } catch (error) {
      dispatch(set_loading_action(false));
      console.error(error);
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 4,
      }}
    >
      <View
        style={{
          borderRadius: 10,
          borderColor: grey,
          borderWidth: 1,
          padding: 8,
          marginTop: 10,
        }}
      >
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
              justifyContent: "start",
              gap: 10,
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
            <View
              style={{
                width: "81%",
              }}
            >
              <View>
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
                {item?.location?.address}
              </Text>

              <Flex_Box
                style={{
                  flexDirection: "row",
                  justifyContent: "start",
                  gap: 10,
                  marginTop: 4,
                  flexWrap: "wrap",
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

        <FlatList
          data={filtered_tags}
          horizontal={true}
          contentContainerStyle={{
            marginTop: 10,
          }}
          renderItem={({ item }) => {
            return (
              <Text
                style={{
                  color: grey,
                  paddingVertical: 2,
                  paddingHorizontal: 5,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: grey,
                  marginRight: 10,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {item?.tagName}
              </Text>
            );
          }}
        />

        {/* <Flex_Box
        style={{
          flexDirection: "row",
          justifyContent: "start",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {filtered_tags?.length > 0 &&
          filtered_tags?.map((el) => {
            <Text
              style={{
                color: grey,
              }}
            >
              {el?.tagName}
            </Text>;
          })}
      </Flex_Box> */}

        <Flex_Box
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            marginTop: 10,
          }}
        >
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
          <Button_Comp
            label="Go Now"
            text_style={{
              fontSize: 12,
            }}
            btn_style={{
              paddingVertical: 1,
              height: 40,
              borderRadius: 10,
              width: "45%",
            }}
            onClick={() => {
              openGoogleMapsNavigation(
                item?.location?.lat,
                item?.location?.lng
              );
            }}
          />
        </Flex_Box>
        <Flex_Box
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Fav_Modal
            style={{
              width: subscribe_btn ? "45%" : "100%",
            }}
            toggle_fav={toggle_fav}
            additional_shop_data={item}
          />
          {subscribe_btn && (
            <Button_Comp
              btn_style={{
                backgroundColor: "pink",
                paddingVertical: 1,
                height: 40,
                borderRadius: 10,
                marginTop: 10,
                width: "45%",
                borderColor: light_grey,
                borderWidth: 1,
              }}
              text_style={{
                color: "#fff",
              }}
              label={"Unsubscribe"}
              onClick={() => {
                toggle_Subscribe(item?.id, {
                  isSubscribed: false,
                });
              }}
            />
          )}
        </Flex_Box>
      </View>
    </View>
  );
};

export default Store_Item;
