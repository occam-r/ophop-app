import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Flex_Box from "../../../../../../utilities/Flex_Box";
import { light_theme } from "../../../../../../utilities/colors";
import {
  formatPostDeadline,
  get_meridian_time,
} from "../../../../../../utilities/Get_Meridian_Time";
import { Weekdays } from "../../../../../../utilities/WeekDays";
import Bottom_Modal from "../../../../../../utilities/Bottom_Modal";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { set_loading_action } from "../../../../../../redux_prog/actions/base_action";
import {
  get_store_posts_api,
  get_store_products_api,
  like_store_post_api,
  show_post_interest_api,
} from "../../../../../../apis";
import Button_Comp from "../../../../../../utilities/Button_Comp";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import return_error from "../../../../../../utilities/Return_Error";

const Posts = ({ navigation, token, tab_index }) => {
  const { text_color, green, dark_grey, light_grey, grey, pink } = light_theme;

  const isfocused = useIsFocused();
  const dispatch = useDispatch();
  const { params } = useRoute();

  const [open, setopen] = useState(false);

  const [posts, setposts] = useState([]);

  const get_store_posts = () => {
    // console.warn({tab_index});
    
    // if (tab_index == 1) {
      dispatch(set_loading_action(true));
      get_store_posts_api(params?.id, 1, 10, token)
        .then((res) => {
          dispatch(set_loading_action(false));
          console.warn("Posts===================>");
          console.warn(JSON.stringify(res.data?.data?.shopPosts));
          setposts(res.data?.data?.shopPosts);
        })
        .catch((err) => {
          dispatch(set_loading_action(false));
          console.error(return_error(err));
        });
    // }
  };

  const like_post = (id, isLiked) => {
    dispatch(set_loading_action(true));
    like_store_post_api(
      id,
      {
        isLiked,
      },
      token
    )
      .then((res) => {
        if (res.data?.status == true) {
          get_store_posts();
        } else {
          dispatch(set_loading_action(false));
        }
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.error(return_error(err));
      });
  };

  const show_interest = (id, isInterested) => {
    dispatch(set_loading_action(true));
    show_post_interest_api(id, { isInterested }, token)
      .then((res) => {
        if (res.data?.status == true) {
          get_store_posts();
        } else {
          dispatch(set_loading_action(false));
        }
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.error(return_error(err));
      });
  };

  useEffect(get_store_posts, [isfocused, tab_index]);

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: 17,
      }}
    >
      <View
        style={{
          paddingBottom: 8,
        }}
      >
        {posts?.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={posts}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    marginTop: 0,
                    marginBottom: 15,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setopen(true);
                    }}
                    key={index}
                  >
                    <Text
                      style={{
                        color: text_color,
                      }}
                    >
                      {item?.postTitle}
                    </Text>
                    {item?.startTime && (
                      <Flex_Box
                        style={{
                          marginTop: 5,
                          backgroundColor: light_grey,
                          borderRadius: 5,
                          padding: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: pink,
                            fontWeight: 500,
                          }}
                        >
                          {formatPostDeadline(item?.startTime, item?.endTime)}
                        </Text>
                      </Flex_Box>
                    )}
                  </TouchableOpacity>

                  <Flex_Box
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button_Comp
                      btn_style={{
                        width: item?.isEvent ? "49%" : "100%",
                        paddingVertical: 12,
                        marginTop: 10,
                        backgroundColor: item?.isLiked ? pink : light_grey,
                      }}
                      label={""}
                      element={
                        <Flex_Box
                          style={{
                            flexDirection: "row",
                            gap: 5,
                          }}
                        >
                          <FontAwesome6
                            name="heart"
                            size={20}
                            color={item?.isLiked ? "#fff" : dark_grey}
                          />
                          <Text
                            style={{
                              fontWeight: 500,
                              color: item?.isLiked ? "#fff" : dark_grey,
                            }}
                          >
                            Like
                          </Text>
                        </Flex_Box>
                      }
                      onClick={() => {
                        like_post(item?.id, item?.isLiked ? false : true);
                      }}
                    />
                    {item?.isEvent && (
                      <Button_Comp
                        btn_style={{
                          width: "49%",
                          paddingVertical: 12,
                          marginTop: 10,
                          backgroundColor: item?.isInterested
                            ? pink
                            : light_grey,
                        }}
                        label={""}
                        element={
                          <Flex_Box
                            style={{
                              flexDirection: "row",
                              gap: 5,
                            }}
                          >
                            <FontAwesome6
                              name="calendar-check"
                              size={20}
                              color={item?.isInterested ? "#fff" : dark_grey}
                            />
                            <Text
                              style={{
                                fontWeight: 500,
                                color: item?.isInterested ? "#fff" : dark_grey,
                              }}
                            >
                              Interested
                            </Text>
                          </Flex_Box>
                        }
                        onClick={() => {
                          show_interest(
                            item?.id,
                            item?.isInterested ? false : true
                          );
                        }}
                      />
                    )}
                  </Flex_Box>
                </View>
              );
            }}
          />
        )}
        {posts?.length == 0 && (
          <Text
            style={{
              color: "#000",
              textAlign: "center",
            }}
          >
            Nothing to show here at the moment
          </Text>
        )}
      </View>
      <Bottom_Modal
        open={open}
        label={
          <Text
            style={{
              color: grey,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Latest Updates
          </Text>
        }
      >
        <Text
          style={{
            color: grey,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          Latest Updates
        </Text>
      </Bottom_Modal>
    </View>
  );
};

export default Posts;
