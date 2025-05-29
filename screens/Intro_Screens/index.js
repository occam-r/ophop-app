import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import Second_Screen from "./Second_Screen";
import { useDispatch, useSelector } from "react-redux";
import { intro_completed_action } from "../../redux_prog/actions/base_action";
import { dark_theme, light_theme } from "../../utilities/colors";

const Intro_Screens = ({ navigation }) => {
  const theme = useSelector((state) => state?.themeReducer?.theme);
  const theme_config = theme == "light" ? light_theme : dark_theme;
  const { text_color, backgroundColor, shadowColor, grey } = theme_config;

  const slider = useRef();
  const dispatch = useDispatch();

  const slides = [
    // {
    //     func: onNext,
    // },
    {
      func: onNext,
      icon: require("../../images/1696946760864.png"),
      label: "A circular economy, making secondhand first in Australia!",
      sub_text: "Choose fron 20000+ gigs a week at 3000+ companies",
    },
    {
      func: onNext,
      icon: require("../../images/1697544417793.png"),
      label: "The intelligent job search and posting app",
      sub_text: "Earn $20.00 per hour.",
    },
    {
      func: _onDone,
      icon: require("../../images/1697544417602.png"),
      label: "The fastest way to find your dream job",
      sub_text: "Find your dream job with convenience",
    },
  ];

  const [slide_num, setslide_num] = useState(0);

  const onNext = () => {
    slider.current.goToSlide(slide_num + 1, true);
  };

  const onPrev = () => {
    slider.current.goToSlide(slide_num - 1, true);
  };

  const _renderItem = ({ item }) => {
    const { func, icon, label, sub_text } = item;

    return (
      <>
        <Second_Screen
          slide_num={slide_num}
          icon={icon}
          label={label}
          sub_text={sub_text}
          total_slides={3}
          prev_func={onPrev}
          func={_onDone}
        />
      </>
    );
  };

  const _onDone = () => {
    dispatch(intro_completed_action());
    // navigation.navigate('Pre Login');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}
    >
      <AppIntroSlider
        ref={(ref) => (slider.current = ref)}
        renderPagination={() => {
          return null;
        }}
        onSlideChange={(e) => {
          setslide_num(e);
        }}
        showNextButton={false}
        showDoneButton={false}
        renderItem={_renderItem}
        data={slides}
        onDone={_onDone}
        scrollEnabled={false}
      />
    </View>
  );
};

export default Intro_Screens;
