import { View, Text, ScrollView, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Flex_Box from "../../../../../../utilities/Flex_Box";
import {
  generateRandomColor,
  light_theme,
} from "../../../../../../utilities/colors";
import { getTags_api } from "../../../../../../apis";
import { useSelector } from "react-redux";
import { TAG_ICONS } from "../../../../../../utilities/Icons";

const Cat_item = ({ item }) => {
  const { grey, text_color } = light_theme;

  return (
    <Flex_Box
      style={{
        width: "",
        gap: 5,
        marginRight: 15,
      }}
    >
      <Flex_Box
        style={{
          backgroundColor: item?.backgroundColor,
          borderRadius: 50,
          height: 50,
          width: 50,
        }}
      >
        {/* <MaterialIcons name={item?.icon} size={30} color="#fff" /> */}
        <Image
                            source={TAG_ICONS[item?.icon]}
                            style={{
                              height:25,
                              width:25
                            }}
                            />
      </Flex_Box>
      <Text style={{ color: text_color }}>{item?.tagName}</Text>
    </Flex_Box>
  );
};

const Categories = ({ store_tags }) => {
  const { tags } = useSelector((state) => state?.baseReducer);

  const filtered_tags = tags?.filter((el) => {
    return store_tags?.includes(el?.id);
  });

  const { grey, text_color } = light_theme;

  return (
    <View>
      <Text
        style={{
          color: text_color,
          fontWeight: 500,
          fontSize: 16,
        }}
      >
        Store Categories
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
          {filtered_tags?.length > 0 && (
            <FlatList
              horizontal={true}
              data={filtered_tags.slice(0, 10)}
              renderItem={({ item }) => {
                return <Cat_item item={item} />;
              }}
            />
          )}
        </Flex_Box>
      </ScrollView>
    </View>
  );
};

export default Categories;
