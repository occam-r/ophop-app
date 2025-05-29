import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { light_theme } from "../../../../utilities/colors";
import Flex_Box from "../../../../utilities/Flex_Box";
import Ionicons from "react-native-vector-icons/Ionicons";
import Store_Item from "./Store_Item";

const RoutePreview = ({ navigation, route_shop, setroute_shop }) => {
  const { backgroundColor, text_color, grey, dark_grey } = light_theme;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 60,
        width: "100%",
        backgroundColor
      }}
    >
      <Flex_Box
        style={{
          backgroundColor,
          flexDirection: "row",
          gap: 5,
          paddingVertical: 15,
          justifyContent: "start",
          paddingLeft: 10,
          borderBottomWidth: 1,
          borderBottomColor: grey,
        }}
      >
        <TouchableOpacity
        onPress={()=>{
            setroute_shop('')
        }}
        >
          <Ionicons name="arrow-back" size={24} color={text_color} />
        </TouchableOpacity>
        <Text
          style={{
            color: text_color,
            fontSize: 16,
          }}
        >
          Route Preview
        </Text>
      </Flex_Box>
      <Store_Item route_preview={true} item={route_shop} navigation={navigation}/>
    </View>
  );
};

export default RoutePreview;
