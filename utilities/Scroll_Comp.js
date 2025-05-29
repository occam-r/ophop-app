import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Keyboard,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { dark_theme, light_theme } from "./colors";

const Scroll_Comp = ({
  view_style,
  scroll_style,
  scroll_container_style,
  children,
}) => {
  const view_style_obj = view_style || {};
  const scroll_style_obj = scroll_style || {};
  const scroll_container_obj = scroll_container_style || {};

  const theme = useSelector((state) => state?.themeReducer?.theme);
  const theme_config = theme == "light" ? light_theme : dark_theme;
  const { text_color, backgroundColor, shadowColor, grey } = theme_config;

  const screenheight = Dimensions.get("screen").height;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (Platform.OS == "ios") {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        ({ endCoordinates }) => {
          setKeyboardHeight(endCoordinates.height + 70);
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 10);
        }
      );

      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardHeight(0);
        }
      );

      // Clean up listeners when component unmounts
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }
  }, []);

  return (
    <View
      style={
        Platform.OS == "ios"
          ? {
              // flex: 1,
              height: screenheight ,
              backgroundColor,
              ...view_style_obj,
            }
          : {
            height: screenheight,
              backgroundColor,
              flex: 1,
              ...view_style_obj,
            }
      }
    >
      <ScrollView
        ref={scrollViewRef}
        style={{
          ...scroll_style_obj,
        }}
        contentContainerStyle={scroll_container_style}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
};

export default Scroll_Comp;
