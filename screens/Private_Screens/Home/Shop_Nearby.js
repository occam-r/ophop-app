import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Flex_Box from "../../../utilities/Flex_Box";
import Button_Comp from "../../../utilities/Button_Comp";
import { light_theme, theme_color } from "../../../utilities/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  add_fav_shop_api,
  getNearByShops_api,
  getTags_api,
} from "../../../apis";
import { IMG_BASE_URL, STORAGE_URL } from "../../../apis/config";
import { truncateLongShopName } from "../../../utilities/utilities";
import {
  set_loading_action,
  set_nearby_shops_action,
} from "../../../redux_prog/actions/base_action";
import {
  formatDistance,
  getDistanceBetweenTwoPoints,
  openGoogleMapsNavigation,
} from "../../../utilities/Map_utils";
import {
  set_org_action,
  set_routes_action,
} from "../../../redux_prog/actions/auth_action";
import Fav_Modal from "../../../utilities/Fav_Modal";
import { useIsFocused } from "@react-navigation/native";

const Shop_item = ({
  item,
  isclosest,
  toggle_fav,
  navigation,
  nearby_shops,
}) => {
  const { current_location } = useSelector((state) => state?.baseReducer);
  const { longitude, latitude } = current_location;
  const { grey, text_color } = light_theme;
  const dispatch = useDispatch();

  const { routes, token } = useSelector((state) => state?.authReducer);
  const my_hop_data = routes?.filter((el) => {
    return el?.id == item?.id;
  })[0];

  const togglemyroutes = () => {
    if (my_hop_data) {
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

  return (
    <Flex_Box
      style={{
        width: 200,
        gap: 15,
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
            width: 200,
            gap: 15,
          }}
        >
          <View
            onPress={() => {
              navigation?.navigate("Store Details", {
                id: item?.id,
              });
            }}
          >
            <Flex_Box
              style={{
                width: "",
                gap: 5,
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
                {item.logotype ? (
                  <Image
                    source={{ uri: STORAGE_URL + item?.logotype }}
                    style={{
                      height: 25,
                      width: 25,
                    }}
                  />
                ) : (
                  <FontAwesome6 name="shop" size={20} color="#c9c9c9" />
                )}
                {isclosest && (
                  <Flex_Box
                    style={{
                      position: "absolute",
                      bottom: -10,
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
            </Flex_Box>
          </View>

          <View
            onPress={() => {
              navigation?.navigate("Store Details", {
                id: item?.id,
              });
            }}
          >
            <Text
              style={{
                color: "#000",
                fontWeight: 500,
                fontSize: 16,
              }}
            >
              {truncateLongShopName(item?.storeName,20)}
            </Text>
          </View>
          
          <Text
            style={{
              color: "#c9c9c9",
              fontWeight: 500,
              fontSize: 16,
              marginTop: -15,
            }}
          >
            {item?.location?.suburbName}
          </Text>

          <Flex_Box
            style={{
              flexDirection: "row",
              gap: 10,
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
          </Flex_Box>
        </Flex_Box>
      </TouchableOpacity>

      {/* <Button_Comp
        btn_style={{
          backgroundColor: item?.isFavorite ? "pink" : "#c9c9c9",
          justifyContent: "start",
          paddingVertical: 1,
          height: 40,
          borderRadius: 10,
        }}
        onClick={() => {
          toggle_fav(item?.id, {
            reasonOfAdding: "",
            isFavorite: item?.isFavorite ? false : true,
          });
        }}
        element={
          <Flex_Box
            style={{
              gap: 10,
              flexDirection: "row",
            }}
          >
            <FontAwesome6
              name="heart"
              size={20}
              color={item?.isFavorite ? "#fff" : "grey"}
            />
            <Text style={{ fontWeight: 500, color: "#fff" }}>
              {item?.isFavorite ? "Remove" : "Add to fav"}
            </Text>
          </Flex_Box>
        }
      /> */}
      <Fav_Modal
        style={{
          width: "100%",
        }}
        toggle_fav={() => {
          toggle_fav(item?.id, {
            reasonOfAdding: "",
            isFavorite: item?.isFavorite ? false : true,
          });
        }}
        additional_shop_data={item}
      />
      <Flex_Box
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Button_Comp
          label={my_hop_data ? "Added" : "Add to my hop"}
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
          onClick={togglemyroutes}
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
            openGoogleMapsNavigation(item?.location?.lat, item?.location?.lng);
          }}
        />
      </Flex_Box>
    </Flex_Box>
  );
};

const Shop_Nearby = ({ city_id, token, navigation }) => {
  console.log('Shop_Nearby props:', { city_id, token });
  const { nearby_shops } = useSelector((state) => state?.baseReducer);
  const nearbyshops = nearby_shops;
  const dispatch = useDispatch();
  const IsFocused = useIsFocused();
  const getnearbyshops = () => {
    console.log('getnearbyshops called with:', { city_id, token });
    dispatch(set_loading_action(true));
    getNearByShops_api(city_id, token)
      .then((res) => {
        console.log('getNearByShops_api response:', res.data);
        dispatch(set_loading_action(false));
        dispatch(set_nearby_shops_action(res.data.data.shops));
        dispatch(set_org_action(res.data.data.shops[0]?.organizationIcon));
      })
      .catch((err) => {
        console.error('getNearByShops_api error:', err);
        dispatch(set_loading_action(false));
      });
  };

  const toggle_fav = async (id, data) => {
    try {
      const res = await add_fav_shop_api(id, data, token);
      if (res.data.status == true) {
        dispatch(
          set_nearby_shops_action(
            nearbyshops.map((el) => {
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
      console.error(error);
    }
  };

  useEffect(getnearbyshops, [city_id,IsFocused]);
  const { grey, text_color } = light_theme;

  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      <Text style={{ fontWeight: 500, fontSize: 18, color: text_color }}>
        {"Near You"}
      </Text>
      <ScrollView horizontal={true}>
        <Flex_Box
          style={{
            justifyContent: "start",
            flexDirection: "row",
            marginVertical: 10,
            gap: 15,
            overFlow: "auto",
          }}
        >
          {nearbyshops?.length > 0 && (
            <FlatList
              contentContainerStyle={{ gap: 15 }}
              // columnWrapperStyle={{ gap: 10 }}
              // numColumns={2}
              horizontal={true}
              data={nearbyshops.slice(0, 10)}
              renderItem={({ item, index }) => {
                return (
                  <Shop_item
                    navigation={navigation}
                    item={item}
                    isclosest={index == 0}
                    toggle_fav={toggle_fav}
                    nearby_shops={nearby_shops}
                  />
                );
              }}
            />
          )}
        </Flex_Box>
      </ScrollView>
    </View>
  );
};

export default Shop_Nearby;
