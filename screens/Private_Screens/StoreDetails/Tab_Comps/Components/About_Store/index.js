import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { light_theme } from "../../../../../../utilities/colors";
import Flex_Box from "../../../../../../utilities/Flex_Box";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import Categories from "./Categories";
import { get_about_store_api } from "../../../../../../apis";
import { useIsFocused, useRoute } from "@react-navigation/native";
import Schedule from "./Schedule";
import Donations from "./Donations";
import Latest_Updates from "./Latest_Updates";
import { openLink } from "../../../../../../utilities/Map_utils";
import Gallery from "./Gallery";
import Reviews from "./Review";
import { screen_height } from "../../../../../../utilities/utilities";
import Bottom_Modal from "../../../../../../utilities/Bottom_Modal";
import { formatPostDeadline } from "../../../../../../utilities/Get_Meridian_Time";

const About_Store = ({ navigation, token, store_details,get_store_details }) => {
  const { text_color, dark_grey, light_grey, grey, pink } = light_theme;

  const { params } = useRoute();
  const isFocused = useIsFocused();
  const [open, setopen] = useState(false);
  const [post_details, setpost_details] = useState({});

  return (
    <View
      style={{
        flex: 1,
          paddingBottom: 17,
          // height: screen_height - 400,
        // height: 400,
        // marginTop:-300
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{
            padding: 10,
            // paddingBottom: 60,
            display: "flex",
            gap: 5,
          }}
        >
          <Text
            style={{
              color: text_color,
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            Bio
          </Text>
          {/* Social Links */}
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "start",
              paddingVertical: 5,
              gap: 10,
            }}
          >
            {store_details?.instagram && (
              <TouchableOpacity
                onPress={() => {
                  openLink(store_details?.instagram);
                }}
              >
                <FontAwesome name="instagram" size={30} color="#000" />
              </TouchableOpacity>
            )}
            {store_details?.facebook && (
              <TouchableOpacity
                onPress={() => {
                  openLink(store_details?.facebook);
                }}
              >
                <FontAwesome name="facebook-square" size={30} color="#000" />
              </TouchableOpacity>
            )}
            {store_details?.twitter && (
              <TouchableOpacity
                onPress={() => {
                  openLink(store_details?.twitter);
                }}
              >
                <FontAwesome name="twitter" size={30} color="#000" />
              </TouchableOpacity>
            )}
            {store_details?.website && (
              <TouchableOpacity
                onPress={() => {
                  openLink(store_details?.website);
                }}
              >
                <AntDesign name="earth" size={25} color="#000" />
              </TouchableOpacity>
            )}
          </Flex_Box>
          {/* ------------------------- */}

          {/* Store description  */}
          {store_details?.description && (
            <Text
              style={{
                color: dark_grey,
                fontWeight: 500,
                fontSize: 16,
              }}
            >
              {store_details?.description}
            </Text>
          )}

          {/* --------------------------- */}

          {/* Store categories  */}
          <Categories store_tags={store_details?.tags} />
          {/* --------------------------- */}

          {/* Store schedule  */}
          {store_details?.schedule && (
            <Schedule schedule={store_details?.schedule} />
          )}
          {/* --------------------------- */}

          {/* Store schedule  */}
          {store_details?.donations?.length > 0 && (
            <Donations donations={store_details?.donations} />
          )}
          {/* --------------------------- */}

          {/* Latest Posts  */}
          {store_details?.latestPosts?.length > 0 && (
            <Latest_Updates
              latest_updates={store_details?.latestPosts}
              open={open}
              setopen={setopen}
              setpost_details={setpost_details}
            />
          )}
          {/* --------------------------- */}

          {/* Gallery  */}
          {store_details?.gallery?.length > 0 && (
            <Gallery gallery_imgs={store_details?.gallery} />
          )}
          {/* --------------------------- */}

          {/* Reviews  */}
          {/* {store_details?.reviews?.length > 0 && ( */}
            <Reviews store_details={store_details} get_store_details={get_store_details}/>
          {/* )} */}
          {/* --------------------------- */}
        </View>
      </ScrollView>
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
{
  post_details?.startTime &&
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
}
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
  );
};

export default About_Store;
