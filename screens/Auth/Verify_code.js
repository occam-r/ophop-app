import { Text, TouchableOpacity, Dimensions, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { dark_theme, light_theme, theme_color } from "../../utilities/colors";
import { useDispatch, useSelector } from "react-redux";
import Scroll_Comp from "../../utilities/Scroll_Comp";
import Form_Item from "../../utilities/Form_Item";
import Icon from "react-native-vector-icons/FontAwesome";
import Button_Comp from "../../utilities/Button_Comp";
import Flex_Box from "../../utilities/Flex_Box";

const Verify_code = ({ navigation }) => {
  const theme = useSelector((state) => state?.themeReducer?.theme);
  const theme_config = theme == "light" ? light_theme : dark_theme;
  const { text_color, backgroundColor, shadowColor, grey } = theme_config;

  return (
    <>
      <Scroll_Comp
        view_style={
          Platform.OS == "ios"
            ? {
                backgroundColor,
              }
            : {
                flex: 1,
                backgroundColor,
              }
        }
        scroll_container_style={{
          marginTop: 5,
          paddingHorizontal: 20,
        }}
      >
        <Flex_Box
          style={{
            justifyContent: "space-between",
            marginTop: 50,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: theme_color,
            }}
          >
            OpHop.
          </Text>
          <Button_Comp
            btn_style={{
              backgroundColor: "#fff",
              justifyContent: "flex-end",
              paddingRight: 10,
              width: 100,
            }}
            text_style={{
              color: theme_color,
              fontWeight: 500,
              fontSize: 15,
              textAlign: "right",
            }}
            onClick={() => {
              navigation.navigate("Login");
            }}
            label={"Back to login"}
          />
        </Flex_Box>

        <Text
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: "#000",
            marginTop: 5,
          }}
        >
          Enter verification code
        </Text>
        <Text style={{ fontSize: 18, color: "#000" }}>
          Enter your verification code
        </Text>
        <Form_Item
          style={{
            marginTop: 30,
            width: "100%",
          }}
          input_style={{
            paddingLeft: 10,
            height: 60,
          }}
          placeholder={"00000"}
        />
        <Button_Comp
          label={"Confirm"}
          onClick={() => {
            navigation.navigate("Login");
        }}
        />
      </Scroll_Comp>
    </>
  );
};

export default Verify_code;
