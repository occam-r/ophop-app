import {
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { dark_theme, light_theme, theme_color } from "../../utilities/colors";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { screen_height, screen_width } from "../../utilities/utilities";
import Form_Item from "../../utilities/Form_Item";
import Flex_Box from "../../utilities/Flex_Box";

export const Sidebar_Toggle = ({ func, sub_route, style }) => {
  const style_obj = style || {};
  return (
    <TouchableOpacity
      style={{
        // backgroundColor: "#000",
        borderRadius: 50,
        position: "absolute",
        top: Platform.OS == "ios" ? 20 : 13,
        left: 10,
        zIndex: 2000,
        // zIndex: 10,
        padding: 10,
        ...style_obj,
      }}
      onPress={func}
    >
      {!sub_route && (
        <SimpleLineIcons name="menu" size={30} color={theme_color} />
      )}
      {sub_route && (
        <MaterialIcons name="arrow-back-ios" size={30} color={theme_color} />
      )}
      {/* <Image
                source={sub_route ? require("../../images/back_icon.png") : require('../../images/hamburger.png')}
                style={{
                    height: 20,
                    width: 20
                }}
            /> */}
    </TouchableOpacity>
  );
};

export const Sidebar_Toggle_Bar = ({ label, sub_route, func, suffix }) => {
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: theme_color,
        color: "red",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "start",
        gap: 20,
        paddingVertical: 14,
        paddingHorizontal: 15,
        position: "relative",
        marginTop: Platform.OS == "ios" ? 20 : 0,
        zIndex: 2000,
      }}
    >
      

      {func && (
        <TouchableOpacity onPress={func}>
          <Image
            source={
              sub_route
                ? require("../../images/back_icon.png")
                : require("../../images/hamburger.png")
            }
            style={{
              height: 23,
              width: 23,
              // objectFit:"cover"
            }}
          />
        </TouchableOpacity>
      )}
      <Text
        style={{
          fontWeight: 600,
          color: "#fff",
          fontSize: 20,
        }}
      >
        {label}
      </Text>
      {suffix && (
        <View
          style={{
            position: "absolute",
            right: 20,
            top: 18,
          }}
        >
          {suffix}
        </View>
      )}
    </View>
  );
};
