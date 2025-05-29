import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Sidebar_Toggle_Bar } from "../../Sidebar/Sidebar_Toggle";
import Flex_Box from "../../../utilities/Flex_Box";
import { get_events_api, get_total_attended_andgotdeal_api, upd_avatar_api, user_details_api } from "../../../apis";
import { useDispatch, useSelector } from "react-redux";
import return_error from "../../../utilities/Return_Error";
import { useIsFocused } from "@react-navigation/native";
import { STORAGE_URL } from "../../../apis/config";
import { light_theme, theme_color } from "../../../utilities/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button_Comp from "../../../utilities/Button_Comp";
import {
  logout_action,
  set_token_action,
  set_user_action,
} from "../../../redux_prog/actions/auth_action";
import { set_item } from "../../../utilities/local_storage";
import BottomBar from "../../BottomBar";
import Alert_comp from "../../../utilities/Alert_comp";
import { convert_into_base64, docPicker } from "../../../utilities/Img_Picker";
import { set_loading_action } from "../../../redux_prog/actions/base_action";
import { screen_height } from "../../../utilities/utilities";
import Bottom_Drawer from "../../../utilities/Bottom_Drawer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ImageCropPicker from "react-native-image-crop-picker";

const Profile_Item = ({ label, func }) => {
  const { text_color, grey } = light_theme;
  return (
    <TouchableOpacity onPress={func}>
      <Flex_Box
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          paddingHorizontal: 15,
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
          {label}
        </Text>
        <FontAwesome name="angle-right" size={25} color={text_color} />
      </Flex_Box>
    </TouchableOpacity>
  );
};

const Account = ({ navigation }) => {
  const { token, user_data } = useSelector((state) => state?.authReducer);
  const IsFocused = useIsFocused();
  const [index_change_func, setindex_change_func] = useState(() => {});

  const [user_details, setuser_details] = useState({});
  const [attened_count, setattened_count] = useState(0);
  const [got_deal_count, setgot_deal_count] = useState(0);
  // const [city_data, setcity_data] = useState({});

  const { text_color, light_grey,grey } = light_theme;

  const get_store_posts = () => {
    dispatch(set_loading_action(true));
    get_total_attended_andgotdeal_api(token)
      .then((res) => {
        dispatch(set_loading_action(false));
        console.warn(res.data);
        setattened_count(res.data.data.total_attended);
        setgot_deal_count(res.data.data.total_got_deal);
        
        // setattened_count(res.data?.data?.events?.filter((el)=>{
        //   return el?.deadlineText == "Attended"
        // })?.length);
        // setgot_deal_count(res.data?.data?.events?.filter((el)=>{
        //   return el?.deadlineText == "Got Deal"
        // })?.length);
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.log("==============================>");
        console.error(err);
        console.log("==============================>");
      });
  };

  const get_user_details = () => {
    user_details_api(token)
      .then((res) => {
        setuser_details(res.data?.data);
      })
      .catch((err) => {
        console.error(return_error(err));
      });
  };

  useEffect(()=>{
    get_user_details();
    get_store_posts();
  }
    , [IsFocused]);

  const dispatch = useDispatch();

  const upd_avatar = (uri) => {
    dispatch(set_loading_action(true));
    upd_avatar_api({ userAvatar: uri }, token)
      .then((res) => {
        dispatch(set_loading_action(false));
        console.warn(res.data);
        if (res.data?.status == true) {
          setuser_details({
            ...user_details,
            userAvatar: res.data?.data?.userAvatar,
          });
          // console.warn(STORAGE_URL + res.data?.data?.userAvatar);
        }
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        Alert_comp("Error", return_error(err));
      });
  };

  return (
    <>
      <Sidebar_Toggle_Bar label={"Account"} />
      <View
        style={{
          // marginTop: 15,
          flex: 1,
          paddingBottom: 60,
          backgroundColor:"#fff"
          // height: screen_height - 100,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Flex_Box>
            <View
              style={{
                position: "relative",
              }}
            >
              <Image
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 100,
                  marginBottom: 10,
                }}
                source={{ uri: STORAGE_URL + user_details?.userAvatar }}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: 15,
                  right: 0,
                }}
                onPress={() => {
                  index_change_func(1);
                  // docPicker((base64) => {
                  //   upd_avatar(base64);
                  // });
                }}
              >
                <Flex_Box
                  style={{
                    padding: 5,
                    backgroundColor: theme_color,
                    borderRadius: 50,
                    width: 23,
                  }}
                >
                  <FontAwesome name="pencil" color="#fff" size={12} />
                </Flex_Box>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontWeight: 600,
                color: text_color,
                fontSize: 20,
              }}
            >
              {user_details?.username}
            </Text>
            <Text
              style={{
                fontWeight: 600,
                color: text_color,
                fontSize: 15,
              }}
            >
              {user_details?.phoneNumber}
            </Text>
            <Flex_Box
              style={{
                width: "",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Flex_Box
                style={{
                  width: "",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontWeight: 600,
                    color: text_color,
                  }}
                >
                  Attended:&nbsp;
                </Text>
                <Text
                  style={{
                    color: text_color,
                  }}
                >
                  {/* {user_details?.attendedPostCount} */}
                  {attened_count}
                </Text>
              </Flex_Box>

              <Flex_Box
                style={{
                  width: "",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontWeight: 600,
                    color: text_color,
                  }}
                >
                  Got Deal:&nbsp;
                </Text>
                <Text
                  style={{
                    color: text_color,
                  }}
                >
                  {/* {user_details?.gotDealPostCount} */}
                  {got_deal_count}
                </Text>
              </Flex_Box>
            </Flex_Box>
            <Flex_Box style={{ marginTop: 10 }}></Flex_Box>
            <Profile_Item
              func={() => {
                navigation.navigate("Cart");
              }}
              label={"Shopping Cart"}
            />
            <Profile_Item
              func={() => {
                navigation?.navigate("Order History");
              }}
              label={"Orders"}
            />
            <Profile_Item
              func={() => {
                navigation?.navigate("Subscribed Stores");
              }}
              label={"Subscribed Stores"}
            />
            <Profile_Item
              func={() => {
                navigation?.navigate("Favourite Stores");
              }}
              label={"Favourite Stores"}
            />
            <Profile_Item
              func={() => {
                navigation?.navigate("Recently Visited");
              }}
              label={"Recently Visited"}
            />
            <Profile_Item
              func={() => {
                navigation?.navigate("Set Profile");
              }}
              label={"Profile"}
            />
            <Profile_Item
              func={() => {
                navigation?.navigate("Suggestions");
              }}
              label={"Suggestions"}
            />
            <Profile_Item
              func={() => {
                navigation?.navigate("Change Password");
              }}
              label={"Change Password"}
            />

            <Button_Comp
              btn_style={{
                backgroundColor: light_grey,
                marginTop: 10,
                width: "95%",
                paddingVertical: 14,
                borderWidth:1,
                borderColor:grey
              }}
              label={"Logout"}
              text_style={{
                color: theme_color,
                fontSize: 18,
              }}
              onClick={() => {
                dispatch(logout_action());
                dispatch(set_token_action(""));
                set_item("idToken", "");
              }}
            />
          </Flex_Box>
        </ScrollView>
      </View>
      <BottomBar navigation={navigation} />
      <Bottom_Drawer
        snap_points={["1%", "15%"]}
        label={<></>}
        handleChange={(index) => {
          console.warn(index);
        }}
        setindex_change_func={setindex_change_func}
      >
        <Flex_Box
          style={{
            flexDirection: "row",
            gap: 20,
            marginTop: -8,
            position: "relative",
            paddingLeft: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              ImageCropPicker.openCamera({
                width: 300,
                height: 400,
                cropping: false,
              }).then(async (image) => {
                const result = await fetch(`${image.path}`);
                const data = await result.blob();
                convert_into_base64(data, (base64) => {
                  upd_avatar(base64);
                  index_change_func(0);
                });
              });
            }}
          >
            <Flex_Box
              style={{
                width: "",
              }}
            >
              <MaterialCommunityIcons
                name="camera"
                size={52}
                color={theme_color}
              />
              <Text
                style={{
                  color: "#000",
                }}
              >
                Camera
              </Text>
            </Flex_Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              docPicker((base64, name) => {
                upd_avatar(base64);
                index_change_func(0);
              });
            }}
          >
            <Flex_Box
              style={{
                width: "",
              }}
            >
              <Flex_Box
                style={{
                  height: 52,
                  width: "",
                }}
              >
                <FontAwesome name="picture-o" size={43} color={theme_color} />
              </Flex_Box>
              <Text
                style={{
                  color: "#000",
                }}
              >
                Gallery
              </Text>
            </Flex_Box>
          </TouchableOpacity>
        </Flex_Box>
      </Bottom_Drawer>
    </>
  );
};

export default Account;
