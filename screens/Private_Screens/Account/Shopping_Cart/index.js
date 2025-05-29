import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Sidebar_Toggle_Bar } from "../../../Sidebar/Sidebar_Toggle";
import Scroll_Comp from "../../../../utilities/Scroll_Comp";
import Button_Comp from "../../../../utilities/Button_Comp";
import { light_theme, theme_color } from "../../../../utilities/colors";
import {
  add_remove_products_api,
  get_shopping_cart_api,
  remove_cart_item_api,
} from "../../../../apis";
import { useDispatch, useSelector } from "react-redux";
import return_error from "../../../../utilities/Return_Error";
import { set_loading_action } from "../../../../redux_prog/actions/base_action";
import { useIsFocused } from "@react-navigation/native";
import Flex_Box from "../../../../utilities/Flex_Box";
import { STORAGE_URL } from "../../../../apis/config";
import Checkout_Modal from "./Checkout_Page";
import BottomBar from "../../../BottomBar";
import {
  Not_Found_Text,
  screen_height,
  screen_width,
} from "../../../../utilities/utilities";
import Form_Item from "../../../../utilities/Form_Item";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Nav_Filter from "../Nav_Filter";
import Stripe_Comp from "../../../../utilities/Stripe_Comp";

const Shopping_Cart = ({ navigation }) => {
  const IsFocused = useIsFocused();
  const {
    backgroundColor,
    text_color,
    pink,
    dark_grey,
    light_grey,
    grey,
    green,
  } = light_theme;
  const { token } = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();
  const { tags } = useSelector((state) => state?.baseReducer);

  const [shopping_cart, setshopping_cart] = useState([]);
  const [filtered_arr, setfiltered_arr] = useState([]);
  const [is_checkout, setis_checkout] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [open_search, setopen_search] = useState(false);
  const [search_text, setsearch_text] = useState("");

  const get_shopping_cart = async () => {
    dispatch(set_loading_action(true));
    try {
      const res = await get_shopping_cart_api(token);
      dispatch(set_loading_action(false));
      setshopping_cart(res.data.data.shops);
    } catch (error) {
      dispatch(set_loading_action(false));
      console.error(return_error(error));
    }
  };

  useEffect(() => {
    get_shopping_cart();
    setis_checkout(false);
  }, [IsFocused]);

  const remove_cart_item = (id) => {
    dispatch(set_loading_action(true));
    add_remove_products_api(id, "remove", token)
      .then((res) => {
        if (res.data.status == true) {
          get_shopping_cart();
        } else {
          dispatch(set_loading_action(false));
        }
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.error(err);
      });
  };

  let totalDeliverySum = 0;
  let totalCollectSum = 0;

  shopping_cart?.forEach((item) => {
    if (item.sum_of != "totalCollect") {
      totalDeliverySum += parseInt(item.totalDelivery);
    } else {
      totalCollectSum += parseInt(item.totalCollect);
    }
  });

  useEffect(() => {
    if (search_text) {
      const new_arr = shopping_cart?.filter((el) => {
        const p_arr = el?.products?.filter((item) => {
          return JSON.stringify(item?.productName)
            .toLowerCase()
            ?.includes(search_text?.toLowerCase());
        });
        return p_arr?.length > 0;
      });

      setfiltered_arr(new_arr);
    } else {
      setfiltered_arr([]);
    }
  }, [search_text]);

  return (
    <>
      <Sidebar_Toggle_Bar
        func={() => {
          navigation.goBack();
        }}
        sub_route={true}
        label={"Shopping Cart"}
        suffix={
          <Nav_Filter
            open_search={open_search}
            setopen_search={setopen_search}
            search_text={search_text}
            setsearch_text={setsearch_text}
          />
        }
      />
      <Scroll_Comp
        scroll_container_style={{
          padding: 10,
          paddingBottom: 60,
        }}
      >
        {/* <Stripe_Comp /> */}

        {shopping_cart?.length == 0 && (
          <Not_Found_Text text={`Sorry! Your cart is empty!`} />
        )}
        {is_checkout && (
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "start",
              marginBottom: 5,
              gap: 5,
            }}
          >
            <Text
              style={{
                color: text_color,
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              Total:
            </Text>
            <Text
              style={{
                color: text_color,
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              ${totalCollectSum + totalDeliverySum}
            </Text>
          </Flex_Box>
        )}
        {shopping_cart?.length > 0 && (
          <>
            <Button_Comp
              label={is_checkout ? "Pay" : "Checkout"}
              btn_style={{
                borderWidth: 2,
                borderColor: theme_color,
                backgroundColor,
                paddingVertical: 12,
              }}
              text_style={{
                color: theme_color,
                fontSize: 18,
              }}
              onClick={() => {
                if (is_checkout) {
                  // setModalVisible(true);
                  navigation.navigate("Checkout", {
                    shopping_cart: shopping_cart,
                    amount: totalCollectSum + totalDeliverySum,
                  });
                } else {
                  setis_checkout(true);
                  
                }
              }}
            />
            <FlatList
              data={open_search ? filtered_arr : shopping_cart}
              renderItem={({ item, index }) => {
                const is_collect = item?.sum_of == "totalCollect";
                return (
                  <View
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: text_color,
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                    >
                      {item?.name}
                    </Text>
                    <Flex_Box
                      style={{
                        flexDirection: "row",
                        justifyContent: "start",
                        gap: 20,
                        flexWrap: "wrap",
                      }}
                    >
                      <Flex_Box
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          width: "",
                          flexWrap: "wrap",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 600,
                            color: dark_grey,
                            fontSize: 16,
                          }}
                        >
                          Collect:
                        </Text>
                        <Text
                          style={{
                            fontWeight: 600,
                            color: dark_grey,
                            fontSize: 16,
                          }}
                        >
                          ${item?.totalCollect}
                        </Text>
                      </Flex_Box>
                      <Flex_Box
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          width: "",
                          flexWrap: "wrap",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 600,
                            color: dark_grey,
                            fontSize: 16,
                          }}
                        >
                          Delivery:
                        </Text>
                        <Text
                          style={{
                            fontWeight: 600,
                            color: dark_grey,
                            fontSize: 16,
                          }}
                        >
                          ${item?.totalDelivery}
                        </Text>
                      </Flex_Box>
                    </Flex_Box>

                    {is_checkout && (
                      <Flex_Box
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          // gap: 20,
                          flexWrap: "wrap",
                          paddingTop: 8,
                        }}
                      >
                        <Button_Comp
                          label={"Click & Collect"}
                          text_style={{
                            color: is_collect ? "#fff" : theme_color,
                            fontSize: 16,
                          }}
                          btn_style={{
                            backgroundColor: is_collect ? theme_color : "#fff",
                            borderColor: theme_color,
                            borderWidth: 2,
                            paddingVertical: 8,
                            width: "48%",
                          }}
                          onClick={() => {
                            const new_arr = shopping_cart.map((elem) => {
                              if (elem.id == item.id) {
                                return {
                                  ...item,
                                  sum_of: "totalCollect",
                                };
                              } else {
                                return elem;
                              }
                            });
                            console.warn(new_arr);
                            setshopping_cart(new_arr);
                          }}
                        />
                        <Button_Comp
                          label={"Delivery"}
                          text_style={{
                            color: !is_collect ? "#fff" : theme_color,
                            fontSize: 16,
                          }}
                          btn_style={{
                            backgroundColor: !is_collect ? theme_color : "#fff",
                            borderColor: theme_color,
                            borderWidth: 2,
                            paddingVertical: 8,
                            width: "48%",
                          }}
                          onClick={() => {
                            const new_arr = shopping_cart.map((elem) => {
                              if (elem.id == item.id) {
                                return {
                                  ...item,
                                  sum_of: "totalDelivery",
                                };
                              } else {
                                return elem;
                              }
                            });
                            console.warn(new_arr);
                            setshopping_cart(new_arr);
                          }}
                        />
                      </Flex_Box>
                    )}

                    {item?.products?.length > 0 &&
                      item?.products?.map((li, index) => {
                        const filtered_tags = tags?.filter((el) => {
                          return li?.tags?.includes(el?.id);
                        });
                        return (
                          <>
                            <Flex_Box
                              style={{
                                flexDirection: "row",
                                justifyContent: "start",
                                alignItems: "",
                                gap: 10,
                                // flexWrap: "wrap",
                                marginTop: 10,
                              }}
                            >
                              <Image
                                source={{
                                  uri: STORAGE_URL + li?.productImage,
                                }}
                                style={{
                                  height: 70,
                                  width: 70,
                                  marginTop: 5,
                                }}
                              />
                              <Flex_Box
                                style={{
                                  gap: 2,
                                  width: "75%",
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
                                  {li?.productName}
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
                                    Price: ${li?.productPrice}
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 600,
                                      color: dark_grey,
                                      fontSize: 14,
                                    }}
                                  >
                                    Shipping: ${li?.shippingCost}
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
                                  {li?.isShippingEnabled && (
                                    <Flex_Box
                                      style={{
                                        backgroundColor:
                                          "hsla(119, 50%, 97%, 1)",
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
                                  )}
                                  {li?.isCollectEnabled && (
                                    <Flex_Box
                                      style={{
                                        backgroundColor:
                                          "hsla(119, 50%, 97%, 1)",
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
                                  )}

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
                            {!is_checkout && (
                              <Button_Comp
                                btn_style={{
                                  // width: "95%",
                                  paddingVertical: 12,
                                  marginTop: 10,
                                  backgroundColor: pink,
                                  borderRadius: 5,
                                }}
                                text_style={{
                                  color: "#fff",
                                }}
                                label={"Remove"}
                                onClick={() => {
                                  remove_cart_item(li?.id);
                                }}
                              />
                            )}
                          </>
                        );
                      })}
                  </View>
                );
              }}
            />
          </>
        )}
      </Scroll_Comp>

      {/* <Checkout_Modal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigation={navigation}
        shopping_cart={shopping_cart}
        amount={totalCollectSum + totalDeliverySum}
      /> */}
      <BottomBar navigation={navigation} />
    </>
  );
};

export default Shopping_Cart;
