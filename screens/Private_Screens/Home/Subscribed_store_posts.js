import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Flex_Box from "../../../utilities/Flex_Box";
import Button_Comp from "../../../utilities/Button_Comp";
import { light_theme, theme_color } from "../../../utilities/colors";
import { useSelector } from "react-redux";
import { STORAGE_URL } from "../../../apis/config";
import { truncateLongShopName } from "../../../utilities/utilities";
import dayjs from "dayjs";
import { shadow_css } from "../../../utilities/Shadow_css";
import { formatPostDeadline } from "../../../utilities/Get_Meridian_Time";
import Bottom_Modal from "../../../utilities/Bottom_Modal";
import Shop_Img from "../../../utilities/Shop_Img";

const Subscribed_store_posts = ({ navigation }) => {
  const { grey, text_color, dark_grey, backgroundColor, light_grey, pink } =
    light_theme;

  const { city_details } = useSelector((state) => state?.baseReducer);
  console.log("Full City Details:", JSON.stringify(city_details, null, 2));
  console.log("Subscribed Stores:", city_details?.subscribed);
  console.log("Posts Array:", city_details?.post);

  const subscribed_posts = city_details?.post || [];
  console.log("Processed Subscribed Posts:", JSON.stringify(subscribed_posts, null, 2));

  const [open, setopen] = useState(false);
  const [post_details, setpost_details] = useState({});

  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      <Text style={{ fontWeight: 500, fontSize: 18, color: text_color }}>
        {"Subscribed Store Posts"}
      </Text>
      {subscribed_posts?.length > 0 ? (
        <FlatList
          data={subscribed_posts}
          contentContainerStyle={{
            marginVertical: 5,
          }}
          horizontal={true}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <Flex_Box
                style={{
                  width: 220,
                  backgroundColor,
                  padding: 8,
                  borderRadius: 5,
                  ...shadow_css,
                  margin: 5,
                }}
              >
                <Shop_Img
                  func={() => {
                    navigation?.navigate("Store Details", {
                      id: item?.shopId,
                    });
                  }}
                  img={item.logotype}
                />
                <TouchableOpacity
                  onPress={() => {
                    navigation?.navigate("Store Details", {
                      id: item?.shopId,
                    });
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 500,
                      color: text_color,
                      fontSize: 16,
                    }}
                  >
                    {truncateLongShopName(item?.shopName, 20)}
                  </Text>
                </TouchableOpacity>
                <Flex_Box
                  style={{
                    width: "",
                    flexDirection: "row",
                    gap: 5,
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 500,
                      color: dark_grey,
                    }}
                  >
                    Posted:
                  </Text>
                  <Text
                    style={{
                      fontWeight: 600,
                      color: dark_grey,
                    }}
                  >
                    {dayjs(item?.createdAt).format("DD MMM YYYY h:mm a")}
                  </Text>
                </Flex_Box>
                <Text
                  style={{
                    fontWeight: 500,
                    color: dark_grey,
                    fontSize: 20,
                  }}
                >
                  {truncateLongShopName(item?.postTitle, 20)}
                </Text>
                <Text
                  style={{
                    color: grey,
                    textAlign: "center",
                  }}
                >
                  {truncateLongShopName(item?.postDescription, 25)}
                </Text>
                <Button_Comp
                  label={"Read More"}
                  btn_style={{
                    paddingVertical: 8,
                    marginTop: 5,
                  }}
                  onClick={() => {
                    setopen(true);
                    setpost_details(item);
                  }}
                />
              </Flex_Box>
            );
          }}
        />
      ) : (
        <Flex_Box
          style={{
            justifyContent: "start",
            flexDirection: "row",
            marginVertical: 10,
            gap: 15,
            overFlow: "auto",
          }}
        >
          <Text style={{ color: grey }}>No subscribed store posts.</Text>
        </Flex_Box>
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
            {post_details?.startTime && (
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
            )}
            <Text
              style={{
                color: text_color,
                fontSize: 14,
              }}
            >
              {post_details?.postDescription}
            </Text>
          </Flex_Box>
        </Bottom_Modal>
      )}
    </View>
  );
};

export default Subscribed_store_posts;
