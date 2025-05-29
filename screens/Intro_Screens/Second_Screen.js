import * as React from "react";
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { useSelector } from "react-redux";
import { dark_theme, light_theme, theme_color } from "../../utilities/colors";
import Second_Screen_Item from "./Second_Screen_";

const StatusRoute = () => (
  <Second_Screen_Item
    icon={require("../../images/1696946760864.png")}
    label={"Welcome to OpHop"}
    sub_text={`Australia's first full featured op shopping app.`}
  />
);

const HistoryRoute = () => (
  <Second_Screen_Item
    icon={require("../../images/1697544417793.png")}
    label={"A circular economy, making secondhand first in Australia!"}
    sub_text={
      "Op Stores have the most amazing range of clothing, furniture and household items which, although pre-loved, are high quality, and have stood the test of time."
    }
  />
);

const BusInfoRoute = () => (
  <Second_Screen_Item
    icon={require("../../images/1696946760864.png")}
    label={"OpHop and Away!"}
    sub_text={
      "Connect with friends, stores, and use our optimised Routing system"
    }
  />
);

const renderScene = SceneMap({
  status: StatusRoute,
  history: HistoryRoute,
  bus_info: BusInfoRoute,
});

export default function Second_Screen({ prev_func, func, total_slides }) {
  const windowHeight = Dimensions.get("window").height;
  const smallScreen = windowHeight < 700;

  const theme = useSelector((state) => state?.themeReducer?.theme);
  const theme_config = theme == "light" ? light_theme : dark_theme;
  const { text_color, backgroundColor, shadowColor, grey } = theme_config;

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "status", title: "Status" },
    { key: "history", title: "History" },
    { key: "bus_info", title: "Bus Info" },
  ]);

  const _renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View
        style={{
          backgroundColor,
          flexDirection: "row",
          width: "100%",
          position: "absolute",
          bottom: smallScreen ? "3%" : "9%",
          zIndex: 100,
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
            <View
              style={{
                display: i == index ? "block" : "none",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme_color,
                    paddingVertical: 20,
                    borderRadius: 20,
                    display: "flex",
                    width: "80%",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  onPress={() => {
                    if (i < total_slides - 1) {
                      setIndex(i + 1);
                    } else {
                      func();
                    }
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  >
                    Next
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    //   paddingVertical: 10,
                    borderRadius: 20,
                    display: "flex",
                    width: "80%",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  onPress={() => {
                    func();
                  }}
                >
                  <Text
                    style={{
                      color: theme_color,
                      fontWeight: 500,
                    }}
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
              </>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={_renderTabBar}
      />
    </>
  );
}
