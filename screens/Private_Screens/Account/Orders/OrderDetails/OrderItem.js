import { View, Text, Image, FlatList } from "react-native";
import React from "react";
import { light_theme, theme_color } from "../../../../../utilities/colors";
import Flex_Box from "../../../../../utilities/Flex_Box";
import Button_Comp from "../../../../../utilities/Button_Comp";
import { IMG_BASE_URL, STORAGE_URL } from "../../../../../apis/config";
import { useRoute } from "@react-navigation/native";

const OrderItem = ({ order_details }) => {
  const state = useRoute();
  const { backgroundColor, text_color, grey, dark_grey, light_grey, green } =
    light_theme;
  const is_checkout = order_details?.isDelivery == true;
  const is_collect = order_details?.isDelivery == false;
  const address = state?.params?.address;
  
  return (
    <View
      style={{
        paddingTop: 10,
        paddingHorizontal: 10,
        backgroundColor,
      }}
    >
      <Text
        style={{
          color: text_color,
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        {order_details?.name}
      </Text>
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
            onClick={() => {}}
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
            onClick={() => {}}
          />
        </Flex_Box>
      )}
      {order_details?.products?.length > 0 && (
        <FlatList
          data={order_details?.products}
          renderItem={({ item }) => {
            return (
              <Flex_Box
                style={{
                  flexDirection: "row",
                  justifyContent: "start",
                  alignItems: "",
                  gap: 10,
                  // flexWrap: "wrap",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: grey,
                }}
              >
                <Image
                  source={{
                    uri: STORAGE_URL + item?.productImage,
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
                      Price: ${item?.productPrice}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 600,
                        color: dark_grey,
                        fontSize: 14,
                      }}
                    >
                      Shipping: ${item?.shippingCost}
                    </Text>
                  </Flex_Box>
                  <Text
                    style={{
                      color: grey,
                      fontSize: 14,
                      textWrap: "wrap",
                      whiteSpace: "wrap",
                      maxWidth: 230,
                    }}
                  >
                    {address}
                  </Text>
                </Flex_Box>
              </Flex_Box>
            );
          }}
        />
      )}
    </View>
  );
};

export default OrderItem;
