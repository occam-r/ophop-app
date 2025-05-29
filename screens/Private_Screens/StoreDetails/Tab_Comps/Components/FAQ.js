import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { light_theme, theme_color } from "../../../../../utilities/colors";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { set_loading_action } from "../../../../../redux_prog/actions/base_action";
import return_error from "../../../../../utilities/Return_Error";
// import Add_Volunteers_Modal from "./Add_Volunteer_Modal";
import { get_questions_api } from "../../../../../apis";
import Flex_Box from "../../../../../utilities/Flex_Box";
import { screen_height } from "../../../../../utilities/utilities";

const FAQ = ({ navigation, token, tab_index }) => {
  const { text_color, green, dark_grey, light_grey, grey, pink } = light_theme;

  const isfocused = useIsFocused();
  const dispatch = useDispatch();
  const { params } = useRoute();

  const [questions, setquestions] = useState([]);

  const get_questions = () => {
    // if (tab_index == 7) {
      dispatch(set_loading_action(true));
      get_questions_api(params?.id, 0, 10, token)
        .then((res) => {
          dispatch(set_loading_action(false));
          console.warn(res.data);
          setquestions([...res.data?.data?.shopQuestions]);
        })
        .catch((err) => {
          dispatch(set_loading_action(false));
          console.error(return_error(err));
        });
    // }
  };

  useEffect(get_questions, [isfocused, tab_index]);

  return (
    <>
      <View
        style={{
          // height: 390,
          flex: 1,
        }}
      >
        <View
          style={{
            paddingBottom: 8,
          }}
        >
          {questions?.length > 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={questions}
              renderItem={({ item, index }) => {
                return (
                  <Flex_Box
                    style={{
                      paddingVertical: 10,
                      justifyContent: "start",
                      alignItems: "start",
                      borderBottomWidth: 1,
                      borderBottomColor: grey,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: text_color,
                      }}
                    >
                      {item?.question}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: dark_grey,
                      }}
                    >
                      {item?.answer}
                    </Text>
                  </Flex_Box>
                );
              }}
            />
          )}
          {
            questions?.length == 0 &&
            <Text
            style={{
              color:"#000",
              textAlign:"center"
            }}
            >
              Nothing to show here at the moment
            </Text>
           }
        </View>
      </View>
    </>
  );
};

export default FAQ;
