import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { dark_theme, light_theme, theme_color } from "../../utilities/colors";
// import { setTheme } from "../../redux_prog/actions/theme_action";
import {
  logout_action,
  set_token_action,
} from "../../redux_prog/actions/auth_action";
import { get_item, set_item } from "../../utilities/local_storage";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

const Sidebar = (props) => {
  const { navigation } = props;
  //   const theme = useSelector((state) => state?.themeReducer?.theme);
  const theme_config = light_theme;
  const { text_color, backgroundColor, shadowColor, grey } = theme_config;
  const dispatch = useDispatch();

  const user_data = useSelector(
    (state) => state?.authReducer?.user_data?.user_data
  );

  const Nav_Item = ({ label, sub_text, link, icon, func, image }) => {
    return (
      <View><Text></Text>
      
      <TouchableOpacity
        onPress={() => {
          if (link == "-") {
            func();
          } else {
            navigation.navigate(link);
          }
        }}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          marginBottom: 20,
          gap:10
        }}
      >
   
        {image && (
          <Image
            source={image}
            style={{
              width: 15,
              height: 15,
              position: "absolute",
              left: 10,
              top: 5,
            }}
          />  
        )}
        <View
          style={{
            width: 20,
          }}
        >
          {icon || null}
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: text_color,
            }}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
       </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:'',
        padding: 25,
        // display:"none"
      }}
    >
      <View
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "start",
          alignItems: "start",
          // flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: 30,
        }}
      >
        <Image
          style={{
            width: 80,
            height: 80,
            borderRadius: 60,
          }}
          source={require("../../images/ryan.webp")}
        />
        {/* <View
          style={{
            marginLeft: 10,
            marginTop: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: text_color,
            }}
          >
            {user_data?.name}
          </Text>
          <Text
            style={{
              fontSize: 13,
              // fontWeight: 500,
              color: grey,
              marginTop: 2,
            }}
          >
            {user_data?.tel_number}
          </Text>
        </View> */}
      </View>
      <Nav_Item
        link="Home"
        icon={<Icon name="home" size={20} color={theme_color} />}
        label={"ce"}
      />
      <Nav_Item
        link="Hop"
        icon={<Icon name="map-marker" size={20} color={theme_color} />}
        label={"Hop"}
      />
      <Nav_Item
        link="Account"
        icon={<Icon name="user" size={20} color={theme_color} />}
        label={"Account"}
      />
      <Nav_Item
        link="-"
        icon={<Ionicons name="exit" size={20} color={theme_color} />}
        label={"Logout"}
        func={() => {
          dispatch(logout_action());
          dispatch(set_token_action(""));
          set_item("idToken", "");
        }}
      />
    </View>
  );
};

export default Sidebar;
