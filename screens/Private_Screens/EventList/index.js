import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Sidebar_Toggle_Bar } from "../../Sidebar/Sidebar_Toggle";
import BottomBar from "../../BottomBar";
import { light_theme } from "../../../utilities/colors";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { set_loading_action } from "../../../redux_prog/actions/base_action";
import {
  get_events_api,
  get_store_posts_api,
  like_store_post_api,
  post_attended_api,
  show_post_interest_api,
} from "../../../apis";
import return_error from "../../../utilities/Return_Error";
import Flex_Box from "../../../utilities/Flex_Box";
import Button_Comp from "../../../utilities/Button_Comp";
import { formatPostDeadline } from "../../../utilities/Get_Meridian_Time";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Bottom_Modal from "../../../utilities/Bottom_Modal";
import { IMG_BASE_URL } from "../../../apis/config";
import { Not_Found_Text } from "../../../utilities/utilities";
import Got_Deal from "./Got_Deal";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Search_events from "./Search_events";
import Form_Item from "../../../utilities/Form_Item";

const EventList = ({ navigation }) => {
  const {
    text_color,
    green,
    dark_grey,
    light_grey,
    grey,
    pink,
    backgroundColor,
  } = light_theme;
  const { token } = useSelector((state) => state?.authReducer);

  const isfocused = useIsFocused();
  const dispatch = useDispatch();
  const { params } = useRoute();

  const [open, setopen] = useState(false);

  const [posts, setposts] = useState([]);
  const [modalVisible, setmodalVisible] = useState(false);

  const get_store_posts = () => {
    dispatch(set_loading_action(true));
    console.warn(token);
    
    get_events_api(token)
      .then((res) => {
        dispatch(set_loading_action(false));
        console.warn("==============================>");
        console.warn(res.data?.data?.events);
        console.warn("==============================>");
        setposts(res.data?.data?.events);
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.log("==============================>");
        console.error(err);
        console.log("==============================>");
      });
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

  const attended = (id, isAttended, code) => {
    dispatch(set_loading_action(true));
    post_attended_api(id, { isAttended, code:code || '' }, token)
      .then((res) => {
        if (res.data?.status == true) {
          get_store_posts();
        } else {
          dispatch(set_loading_action(false));
        }
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.error(JSON.stringify(err));
        console.error(return_error(err));
      });
  };

  useEffect(get_store_posts, [isfocused]);

  const [post_details, setpost_details] = useState({});
  const [selected_shop_id, setselected_shop_id] = useState("");
  const [search_modalVisible, setsearch_modalVisible] = useState(false);
  const [search_text, setsearch_text] = useState('')

  return (
    <>
      <Sidebar_Toggle_Bar label={"Events List"}
      
              suffix={
                search_modalVisible ?<Form_Item
          value={search_text}
          onchange={(e) => {
            setsearch_text(e);
          }}
          style={{
            width:180,
            top:-10,
            right:-10
          }}
          placeholder={"Enter text here.."}
          suffix={
            <TouchableOpacity
            onPress={()=>{
              setsearch_text("");
              setsearch_modalVisible(false)
            }}
            style={{
right:5
            }}
            >
                  <Entypo name="cross" size={20} color="#000" />
            </TouchableOpacity>
          }
        />
        :
                <TouchableOpacity
                  onPress={() => {
                    setsearch_modalVisible(true);
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
          padding: 10,
          paddingBottom: 35,
        }}
      >
        {posts?.length == 0 && (
          <Not_Found_Text
            text={`You have no events! Start exploring stores to find some!`}
          />
        )}
        {posts?.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={search_text? posts?.filter((el)=>{
              return (JSON.stringify(el.shopName)?.toLowerCase()?.includes(search_text?.toLowerCase())
              ||
              JSON.stringify(el.postTitle)?.toLowerCase()?.includes(search_text?.toLowerCase())
              );
            }):posts}
            renderItem={({ item, index }) => {

const color_flag = item?.isAttended?true:new Date(item.endTime) > new Date()?true:false;

              return (
                <View
                  style={{
                    marginTop: 0,
                    marginBottom: 15,
                    borderBottomColor: grey,
                    paddingBottom: 10,
                    borderBottomWidth: 1,
                  }}
                >
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation?.navigate("Store Details", {
                          id: item?.shopId,
                        });
                      }}
                    >
                      <Flex_Box
                        style={{
                          flexDirection: "row",
                          justifyContent: "start",
                          gap: 15,
                          paddingBottom: 5,
                        }}
                      >
                        <Flex_Box
                          style={{
                            backgroundColor: "#fff",
                            borderWidth: 1,
                            borderColor: "#c9c9c9",
                            borderRadius: 50,
                            height: 60,
                            width: 60,
                            position: "relative",
                          }}
                        >
                          {item.logotype ? (
                            <Image
                              source={{ uri: STORAGE_URL + item?.logotype }}
                              style={{
                                height: 25,
                                width: 25,
                              }}
                            />
                          ) : (
                            <FontAwesome6
                              name="shop"
                              size={20}
                              color="#c9c9c9"
                            />
                          )}
                        </Flex_Box>
                        <View>
                          <Text
                            style={{
                              color: text_color,
                              fontWeight: 600,
                              fontSize: 16,
                            }}
                          >
                            {item?.shopName}
                          </Text>
                          <Text
                            style={{
                              color: text_color,
                            }}
                          >
                            {item?.postTitle}
                          </Text>
                        </View>
                      </Flex_Box>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setopen(true);
                        setpost_details(item);
                      }}
                    >
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
                    </TouchableOpacity>
                  </View>

                  <Flex_Box
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button_Comp
                      btn_style={{
                        width: item?.isEvent?"49%":"100%",
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
                    {
                      item?.isEvent &&
                    <Button_Comp
                      btn_style={{
                        width: "49%",
                        paddingVertical: 12,
                        marginTop: 10,
                        // backgroundColor: item?.isAttended
                        //   ? "green"
                        //   : item?.isInterested
                        //   ? pink
                        //   : light_grey,
                        backgroundColor:  color_flag
                          // ? "green"
                          // : item?.isInterested
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
                            color={color_flag? "#fff" : dark_grey}
                          />
                          <Text
                            style={{
                              fontWeight: 500,
                              color: color_flag? "#fff" : dark_grey,
                            }}
                          >
                            {new Date(item.endTime) > new Date()
                              ? "Interested"
                              : item?.deadlineText}
                          </Text>
                        </Flex_Box>
                      }
                      onClick={() => {
                        if (new Date(item.endTime) > new Date()) {
                          show_interest(
                            item?.id,
                            item?.isInterested ? false : true
                          );
                        } else {
                          if (item?.isAttended) {
                            attended(item?.id, false);
                          } else {
                            if (item?.deadlineText == "Got Deal") {
                              setmodalVisible(true);
                              setselected_shop_id(item?.id);
                            } else {
                              attended(item?.id, true);
                            }
                          }
                        }
                      }}
                    />
                    }
                  </Flex_Box>
                </View>
              );
            }}
          />
        )}
        {open && (
          <Bottom_Modal
            open={open}
            setopen={setopen}
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
            <Flex_Box
              style={{
                alignItems: "start",
                gap: 5,
              }}
            >
              <Text
                style={{
                  color: dark_grey,
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {post_details?.postTitle}
              </Text>

              <Flex_Box
                style={{
                  marginTop: 5,
                  backgroundColor: light_grey,
                  borderRadius: 5,
                  padding: 5,
                  flexDirection: "row",
                  justifyContent: "start",
                }}
              >
                <Text
                  style={{
                    color: pink,
                    fontWeight: 500,
                  }}
                >
                  {formatPostDeadline(
                    post_details?.startTime,
                    post_details?.endTime
                  )}
                </Text>
              </Flex_Box>
              <Text
                style={{
                  color: text_color,
                  // fontWeight: 500,
                  fontSize: 14,
                }}
              >
                {post_details?.postDescription}
              </Text>
            </Flex_Box>
          </Bottom_Modal>
        )}
      </View>
      <BottomBar navigation={navigation} />
      <Got_Deal
        selected_shop_id={selected_shop_id}
        setModalVisible={setmodalVisible}
        modalVisible={modalVisible}
        attended={attended}
      />
      {/* <Search_events
modalVisible={modalVisible}
setmodalVisible={setmodalVisible}
navigation={navigation}
setsearch_text={setsearch_text}
      /> */}
    </>
  );
};

export default EventList;
