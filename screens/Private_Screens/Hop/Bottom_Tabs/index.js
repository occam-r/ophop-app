import * as React from "react";
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { useSelector } from "react-redux";
import {
  dark_theme,
  light_theme,
  theme_color,
} from "../../../../utilities/colors";
import { useRoute } from "@react-navigation/native";
import { BASE_URL } from "../../../../apis/config";
import Cities from "./Cities";
import Stores from "./Stores";
import MyHop from "./MyHop";

const Bottom_Tabs = ({ navigation,setroute_shop }) => {
  const route = useRoute();
  const my_hops = useSelector((state) => state?.authReducer);
  //   const { id, avatar } = route?.params;
  const [index, setIndex] = React.useState(0);

  const renderScene = SceneMap({
    cities: () => <Cities navigation={navigation} />,
    stores: () => <Stores setroute_shop={setroute_shop} navigation={navigation} />,
    my_hop: () => <MyHop setroute_shop={setroute_shop} navigation={navigation} />,
  });

  const theme_config = light_theme;
  const { text_color, backgroundColor, shadowColor, grey } = theme_config;

  const layout = useWindowDimensions();

  const [routes] = React.useState([
    { key: "cities", title: "Cities" },
    { key: "stores", title: "Stores" },
    { key: "my_hop", title: "My Hop" },
  ]);

  const _renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View
        style={{
          backgroundColor,
          zIndex: 10,
          flexDirection: "row",
          width: "100%",
        }}
      >
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });

          return (
            <TouchableOpacity
              style={{
                // flex: 1,
                alignItems: "center",
                padding: 16,
                borderBottomColor: theme_color,
                borderBottomWidth: index == i ? 2 : 0,
                width: "33%",
              }}
              onPress={() => setIndex(i)}
            >
              <Animated.Text
                style={{
                  //   marginLeft: i == 0 ? "50%" : 0,
                  opacity,
                  color: index == i ? theme_color : text_color,
                  fontWeight: index == i ? 600 : 400,
                }}
              >
                {route.title +
                  (index != 2 && i == 2
                    ? " (" + (my_hops?.routes?.length || 0) + ")"
                    : "")}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={_renderTabBar}
    />
  );
};

export default Bottom_Tabs;
