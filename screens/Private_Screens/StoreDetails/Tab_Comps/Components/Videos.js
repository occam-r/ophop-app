import { View, Text, Image } from "react-native";
import React from "react";
import Flex_Box from "../../../../../utilities/Flex_Box";
import { IMG_BASE_URL } from "../../../../../apis/config";
import YoutubePlayer from "react-native-youtube-iframe";

const Videos = ({ videos }) => {
  return (
    <Flex_Box
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginVertical: 10,
      }}
    >
      {videos?.length > 0 &&
        videos?.map((el, ind) => {
          return (
            <YoutubePlayer
              height={300}
              width={"100%"}
              videoId={el?.split("=")[1] || ""}
              onChangeState={(e) => {
                console.warn(e);
              }}
            />
          );
        })}
        {
            videos?.length == 0 &&
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
  );
};

export default Videos;
