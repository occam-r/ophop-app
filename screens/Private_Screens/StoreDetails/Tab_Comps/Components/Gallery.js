import { View, Text, Image } from "react-native";
import React from "react";
import Flex_Box from "../../../../../utilities/Flex_Box";
import { IMG_BASE_URL, STORAGE_URL } from "../../../../../apis/config";
import {
  screen_height,
  screen_width,
} from "../../../../../utilities/utilities";
import { ScrollView } from "react-native-gesture-handler";

const Gallery = ({ images }) => {
  return (
    <View
      style={{
        // height: screen_height - 440,
        flex: 1,
      }}
    >
      <ScrollView>
        <Flex_Box
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "start",
            gap: 10,
            marginTop: 10,
          }}
        >
          {images?.length > 0 &&
            [
              ...images,
              ...images,
              ...images,
              ...images,
              ...images,
              ...images,
              ...images,
              ...images,
              ...images,
              ...images,
              ...images,
              ...images,
            ]?.map((el, ind) => {
              return (
                <Image
                  key={ind}
                  source={{ uri: STORAGE_URL + el }}
                  style={{
                    height: 130,
                    width: screen_width - 207,
                    objectFit: "cover",
                  }}
                />
              );
            })}
            {
            images?.length == 0 &&
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

export default Gallery;
