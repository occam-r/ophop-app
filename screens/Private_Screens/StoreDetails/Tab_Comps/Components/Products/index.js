import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Flex_Box from "../../../../../../utilities/Flex_Box";
import {
  generateRandomColor,
  light_theme,
} from "../../../../../../utilities/colors";
import {
  add_remove_products_api,
  getTags_api,
  get_store_products_api,
} from "../../../../../../apis";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { set_loading_action } from "../../../../../../redux_prog/actions/base_action";
import { IMG_BASE_URL, STORAGE_URL } from "../../../../../../apis/config";
import { openLink } from "../../../../../../utilities/Map_utils";
import Button_Comp from "../../../../../../utilities/Button_Comp";
import { screen_height } from "../../../../../../utilities/utilities";

const Products = ({ navigation, token, tab_index }) => {
  const isfocused = useIsFocused();
  const dispatch = useDispatch();
  const [products, setproducts] = useState([]);
  const { params } = useRoute();

  const { nearby_shops, tags } = useSelector((state) => state?.baseReducer);

  const current_shop = nearby_shops?.filter((el) => {
    return el?.id == params?.id;
  })[0];

  const get_store_products = () => {
    // if (tab_index == 1) {
      dispatch(set_loading_action(true));
      get_store_products_api(params?.id, 0, 10, token)
        .then((res) => {
          dispatch(set_loading_action(false));
          console.warn(res.data);
          setproducts(res.data.data.shopProducts);
        })
        .catch((err) => {
          dispatch(set_loading_action(false));
          console.log(err);
        });
    // }
  };

  useEffect(get_store_products, [isfocused]);

  const add_remove_products = (id, status) => {
    dispatch(set_loading_action(true));
    add_remove_products_api(id, status, token)
      .then((res) => {
        console.warn(res.data);
        if (res.data.status == true) {
          get_store_products();
        } else {
          dispatch(set_loading_action(false));
        }
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.error(err);
      });
  };

  const {
    grey,
    text_color,
    blue,
    dark_grey,
    light_grey,
    green,
    backgroundColor,
    pink,
  } = light_theme;

  return (
    <View
      style={{
        // height: screen_height - 400,
        flex: 1,
        paddingBottom: 17,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Flex_Box
          style={{
            justifyContent: "start",
            flexDirection: "row",
            marginVertical: 10,
            gap: 15,
            overFlow: "auto",
          }}
        >
          {products?.length > 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              // horizontal={true}
              data={products}
              renderItem={({ item }) => {
                const filtered_tags = tags?.filter((el) => {
                  return item?.tags?.includes(el?.id);
                });
                return (
                  <View
                    style={{
                      marginBottom: 15,
                      width: "100%",
                    }}
                  >
                    {current_shop?.onlineShopUrl && (
                      <Flex_Box
                        style={{
                          flexDirection: "row",
                          justifyContent: "start",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 600,
                            color: text_color,
                            fontSize: 16,
                          }}
                        >
                          Online Shop:
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            openLink(current_shop?.onlineShopUrl);
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              color: blue,
                            }}
                          >
                            {current_shop?.onlineShopUrl}
                          </Text>
                        </TouchableOpacity>
                      </Flex_Box>
                    )}

                    <Flex_Box
                      style={{
                        flexDirection: "row",
                        justifyContent: "start",
                        alignItems: "",
                        gap: 10,
                        // flexWrap: "wrap",
                        marginTop: 5,
                      }}
                    >
                      <Image
                        source={{ uri: STORAGE_URL + item?.productImage }}
                        style={{
                          height: 70,
                          width: 70,
                          marginTop: 5,
                        }}
                      />
                      <Flex_Box
                        style={{
                          gap: 2,
                          width: "",
                          justifyContent: "start",
                          alignItems: "start",
                          flexWrap: "wrap",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 600,
                            color: grey,
                            fontSize: 16,
                          }}
                        >
                          {item?.productName}
                        </Text>
                        <Flex_Box
                          style={{
                            flexDirection: "row",
                            justifyContent: "start",
                            gap: 15,
                            flexWrap: "wrap",
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: 600,
                              color: dark_grey,
                              fontSize: 14,
                            }}
                          >
                            Price: ${item.productPrice}
                          </Text>
                          <Text
                            style={{
                              fontWeight: 600,
                              color: dark_grey,
                              fontSize: 14,
                            }}
                          >
                            Shipping: ${item.shippingCost}
                          </Text>
                        </Flex_Box>

                        <Flex_Box
                          style={{
                            flexDirection: "row",
                            justifyContent: "start",
                            gap: 10,
                            flexWrap: "wrap",
                            marginTop: 5,
                          }}
                        >
                          <Flex_Box
                            style={{
                              backgroundColor: "hsla(119, 50%, 97%, 1)",
                              borderRadius: 5,
                              color: "green",
                              padding: 5,
                              width: "",
                            }}
                          >
                            <Text
                              style={{
                                color: green,
                                fontSize: 12,
                              }}
                            >
                              Shipping
                            </Text>
                          </Flex_Box>
                          <Flex_Box
                            style={{
                              backgroundColor: "hsla(119, 50%, 97%, 1)",
                              borderRadius: 5,
                              color: "green",
                              padding: 5,
                              width: "",
                            }}
                          >
                            <Text
                              style={{
                                color: green,
                                fontSize: 12,
                              }}
                            >
                              Click & Connect
                            </Text>
                          </Flex_Box>

                          {filtered_tags?.length > 0 &&
                            filtered_tags?.map((el, ind) => {
                              return (
                                <Flex_Box
                                  key={ind}
                                  style={{
                                    // marginTop: 5,
                                    backgroundColor: light_grey,
                                    borderRadius: 5,
                                    padding: 5,
                                    flexWrap: "wrap",
                                    width: "",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: dark_grey,
                                      fontSize: 12,
                                    }}
                                  >
                                    {el?.tagName}
                                  </Text>
                                </Flex_Box>
                              );
                            })}

                          <Flex_Box
                            style={{
                              backgroundColor: light_grey,
                              borderRadius: 5,
                              padding: 5,
                              width: "",
                            }}
                          >
                            <Text
                              style={{
                                color: dark_grey,
                                fontSize: 12,
                              }}
                            >
                              Click & Connect
                            </Text>
                          </Flex_Box>
                        </Flex_Box>
                      </Flex_Box>
                    </Flex_Box>

                    <Button_Comp
                      btn_style={{
                        // width: "95%",
                        paddingVertical: 12,
                        marginTop: 10,
                        backgroundColor: item?.isAdded ? pink : light_grey,
                        borderRadius: 5,
                      }}
                      text_style={{
                        color: item?.isAdded ? "#fff" : dark_grey,
                      }}
                      label={item?.isAdded ? "Remove" : "Add"}
                      onClick={() => {
                        if (item?.isAdded) {
                          add_remove_products(item?.id, "remove");
                        } else {
                          add_remove_products(item?.id, "add");
                        }
                      }}
                    />
                  </View>
                );
              }}
            />
          )}
          {
            products?.length == 0 &&
            <Text
            style={{
              color:"#000",
              textAlign:"center"
            }}
            >
              Nothing to show here at the moment
            </Text>
           }
        </Flex_Box>
      </ScrollView>
    </View>
  );
};

export default Products;
