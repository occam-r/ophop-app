import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Flex_Box from "../../utilities/Flex_Box";
import { light_theme, theme_color } from "../../utilities/colors";
import Entypo from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import { useRoute } from "@react-navigation/native";

const BarItem = ({ label, icon, link, navigation }) => {
  const { grey, light_grey } = light_theme;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation?.navigate(link);
      }}
    >
      <Flex_Box
        style={{
          width: "",
          width:50
        }}
      >
        {icon}
        <Text
          style={{
            color: grey,
            fontSize: 12,
          }}
        >
          {label}
        </Text>
      </Flex_Box>
    </TouchableOpacity>
  );
};

const BottomBar = ({ navigation }) => {
  const { grey, backgroundColor, light_grey } = light_theme;
  const path = useRoute();

  const path_icon_color = (link) => {
    if (path.name == link) {
      return theme_color;
    } else {
      return grey;
    }
  };

  return (
    <Flex_Box
      style={{
        backgroundColor,
        flexDirection: "row",
        position: "absolute",
        bottom: 0,
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: light_grey,
        paddingVertical: 8,
        paddingHorizontal: 20,
      }}
    >
      <BarItem
        link="Home"
        icon={<Icon name="home" size={20} color={path_icon_color("Home")} />}
        label={"Home"}
        navigation={navigation}
      />
      <BarItem
        link="Hop"
        icon={
          <Icon name="map-marker" size={20} color={path_icon_color("Hop")} />
        }
        label={"Hop"}
        navigation={navigation}
      />
      <BarItem
        link="Events"
        icon={
          <Icon name="calendar-o" size={20} color={path_icon_color("Events")} />
        }
        label={"Events"}
        navigation={navigation}
      />
      <BarItem
        link="Friends"
        icon={
          <Icon5
            name="user-friends"
            size={20}
            color={path_icon_color("Friends")}
          />
        }
        label={"Friends"}
        navigation={navigation}
      />
      <BarItem
        link="Account"
        icon={<Icon name="user" size={20} color={path_icon_color("Account")} />}
        label={"Me"}
        navigation={navigation}
      />
    </Flex_Box>
  );
};

export default BottomBar;
