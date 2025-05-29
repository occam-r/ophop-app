import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Sidebar_Toggle_Bar } from "../../../../Sidebar/Sidebar_Toggle";
import { light_theme } from "../../../../../utilities/colors";
import OrderItem from "./OrderItem";
import { get_orders_products_api } from "../../../../../apis";
import { useSelector } from "react-redux";
import { useIsFocused, useRoute } from "@react-navigation/native";

const OrderDetails = ({ navigation }) => {
  const state = useRoute();
  const IsFocused = useIsFocused();
  const { backgroundColor, text_color, grey } = light_theme;
  const { token } = useSelector((state) => state?.authReducer);
  const [order_details, setorder_details] = useState("");

  const get_order_products = () => {
    get_orders_products_api(state?.params?.id,token)
      .then((res) => { 
        console.warn(res.data?.data?.shops[0] || '');
        setorder_details(res.data?.data?.shops[0] || '');
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  useEffect(get_order_products, [IsFocused]);

  return (
    <>
      <Sidebar_Toggle_Bar
        func={() => {
          navigation?.goBack();
        }}
        label={"Order Details"}
        sub_route={true}
      />
      <View
        style={{
          backgroundColor,
          flex: 1,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <OrderItem order_details={order_details} />
        </ScrollView>
      </View>
    </>
  );
};

export default OrderDetails;
