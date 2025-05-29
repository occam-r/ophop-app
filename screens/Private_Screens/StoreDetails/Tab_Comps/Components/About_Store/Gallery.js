import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import Flex_Box from "../../../../../../utilities/Flex_Box";
import { light_theme } from "../../../../../../utilities/colors";
import { get_meridian_time } from "../../../../../../utilities/Get_Meridian_Time";
import { Weekdays } from "../../../../../../utilities/WeekDays";
import { STORAGE_URL } from "../../../../../../apis/config";
import Feather from "react-native-vector-icons/Feather";

const Gallery = ({ gallery_imgs }) => {
  const { text_color, green } = light_theme;

  return (
    <Flex_Box
      style={{
        alignItems: "start",
      }}
    >
      <TouchableOpacity
        style={{
          width: 110,
        }}
      >
        <Flex_Box
          style={{
            flexDirection: "row",
            justifyContent: "start",
            gap: 2,
          }}
        >
          <Text
            style={{
              color: text_color,
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            Gallery ({gallery_imgs?.length})
          </Text>
          <Feather name="arrow-up-right" size={20} color={text_color} />
        </Flex_Box>
      </TouchableOpacity>
      <Flex_Box
        style={{
          justifyContent: "start",
          flexDirection: "row",
          marginVertical: 10,
          gap: 15,
          overFlow: "auto",
          flexWrap: "wrap",
        }}
      >
        {gallery_imgs?.length > 0 &&
          gallery_imgs.slice(0, 2).map((item, index) => {
            return (
              <Image
                source={{ uri: STORAGE_URL + item }}
                style={{
                  height: 120,
                  width: 130,
                  objectFit: "cover",
                }}
              />
            );
          })}
      </Flex_Box>
    </Flex_Box>
  );
};

export default Gallery;
