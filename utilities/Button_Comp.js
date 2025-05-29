import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { theme_color } from "./colors";
import Flex_Box from "./Flex_Box";

const Button_Comp = ({
  loading,
  label,
  btn_style,
  text_style,
  onClick,
  prefix,
  element,
}) => {
  const btn_style_obj = btn_style || {};
  const text_style_obj = text_style || {};

  return (
    <TouchableOpacity
      style={{
        backgroundColor: theme_color,
        paddingVertical: 20,
        borderRadius: 10,
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        opacity: loading ? 0.5 : 1,
        ...btn_style_obj,
      }}
      onPress={() => {
        if (onClick && !loading) {
          onClick();
        }
      }}
    >
      {prefix && (
        <View
          style={{
            position: "absolute",
            left: 10,
            top: 9,
          }}
        >
          {prefix}
        </View>
      )}
      {loading && <ActivityIndicator size="small" color="#fff" />}
      {!loading && (
        <>
          {label && (
            <Text
              style={{
                color: "#fff",
                fontWeight: 500,
                ...text_style,
              }}
            >
              {label}
            </Text>
          )}
          {element || null}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button_Comp;
