import { View, Text, FlatList } from "react-native";
import React from "react";
import Flex_Box from "../../../../../../utilities/Flex_Box";
import { light_theme } from "../../../../../../utilities/colors";
import { get_meridian_time } from "../../../../../../utilities/Get_Meridian_Time";
import { Weekdays } from "../../../../../../utilities/WeekDays";

const Schedule = ({ schedule }) => {
  const { text_color, green } = light_theme;

  const weekdays = Object.keys(schedule)?.map((el, index) => {
    return {
      week_day: el,
      id: index,
    };
  });

  return (
    <View>
      <Text
        style={{
          color: text_color,
          fontWeight: 500,
          fontSize: 16,
        }}
      >
       Opening Hours
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
        {weekdays?.length > 0 &&
          weekdays.map((item, index) => {
            return (
              <View key={index}>
                <Text
                  style={{
                    color: text_color,
                  }}
                >
                  {Weekdays[item?.week_day]}
                </Text>
                <Flex_Box
                  style={{
                    marginTop: 5,
                    backgroundColor: "hsla(119, 50%, 97%, 1)",
                    borderRadius: 5,
                    color: "green",
                    padding: 5,
                  }}
                >
                  <Text
                    style={{
                      color: green,
                    }}
                  >
                    {get_meridian_time(schedule[item?.week_day]?.open) +
                      " - " +
                      get_meridian_time(schedule[item?.week_day]?.close)}
                  </Text>
                </Flex_Box>
              </View>
            );
          })}
      </Flex_Box>
    </View>
  );
};

export default Schedule;
