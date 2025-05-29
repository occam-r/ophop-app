import { View, Text, FlatList } from "react-native";
import React from "react";
import Flex_Box from "../../../../../../utilities/Flex_Box";
import { light_theme } from "../../../../../../utilities/colors";
import { get_meridian_time } from "../../../../../../utilities/Get_Meridian_Time";
import { Weekdays } from "../../../../../../utilities/WeekDays";

const Donations = ({ donations }) => {
  const { text_color, green, dark_grey, light_grey } = light_theme;
  return (
    <View>
      <Text
        style={{
          color: text_color,
          fontWeight: 500,
          fontSize: 16,
        }}
      >
        Donations
      </Text>
      <Flex_Box
        style={{
          justifyContent: "start",
          flexDirection: "row",
          marginVertical: 5,
          gap: 15,
          overFlow: "auto",
          flexWrap: "wrap",
        }}
      >
        {donations?.length > 0 &&
          donations?.map((el, index) => {
            return (
              <Flex_Box
                key={index}
                style={{
                  backgroundColor: "hsla(119, 50%, 97%, 1)",
                  borderRadius: 5,
                  padding: 5,
                  width: "",
                }}
              >
                <Text
                  style={{
                    color: dark_grey,
                  }}
                >
                  {el?.tag_name}
                </Text>
              </Flex_Box>
            );
          })}
      </Flex_Box>
    </View>
  );
};

export default Donations;
