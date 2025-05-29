import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Flex_Box from "./Flex_Box";
import { STORAGE_URL } from "../apis/config";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

const Shop_Img = ({ img, func }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (func) {
          func();
        }
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
        {img ? (
          <Image
            source={{ uri: STORAGE_URL + img }}
            style={{
              height: 25,
              width: 25,
            }}
          />
        ) : (
          <FontAwesome6 name="shop" size={20} color="#c9c9c9" />
        )}
      </Flex_Box>
    </TouchableOpacity>
  );
};

export default Shop_Img;
