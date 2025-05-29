import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
} from "react-native";
import React, { useState } from "react";
import { Sidebar_Toggle_Bar } from "../../Sidebar/Sidebar_Toggle";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { light_theme, theme_color } from "../../../utilities/colors";
import { SceneMap, TabView } from "react-native-tab-view";
import Contacts from "./Contacts";
import Messages from "./Messages";
import Notes from "./Notes";
import SearchContacts from "./SearchContacts";
import BottomBar from "../../BottomBar";
import Requests from "./Requests";

const Friends = ({ navigation }) => {
  const { backgroundColor, text_color } = light_theme;

  const [index, setIndex] = React.useState(0);

  const renderScene = SceneMap({
    contacts: () => <Contacts navigation={navigation} />,
    messages: () => <Messages navigation={navigation} />,
    requests: () => <Requests navigation={navigation} />,
    notes: () => <Notes navigation={navigation} />,
  });

  const layout = useWindowDimensions();

  const [routes] = React.useState([
    { key: "contacts", title: "Contacts" },
    { key: "messages", title: "Messages" },
    { key: "requests", title: "Requests" },
    { key: "notes", title: "Notes" },
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
                paddingHorizontal: 6,
                paddingVertical: 15,
                borderBottomColor: theme_color,
                borderBottomWidth: index == i ? 2 : 0,
                width: "25%",
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
                {route.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const [modalVisible, setmodalVisible] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: 50,
      }}
    >
      <Sidebar_Toggle_Bar
        label={`Friends`}
        suffix={
          <TouchableOpacity
            onPress={() => {
              setmodalVisible(true);
            }}
          >
            <FontAwesome name="search" size={20} color="#fff" />
          </TouchableOpacity>
        }
      />
      <View
        style={{
          flex: 1,
          backgroundColor,
        }}
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={_renderTabBar}
          swipeEnabled={false}
        />
      </View>
      {modalVisible && (
        <SearchContacts
          modalVisible={modalVisible}
          setmodalVisible={setmodalVisible}
          navigation={navigation}
        />
      )}
      <BottomBar navigation={navigation} />
    </View>
  );
};

export default Friends;
