import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Flex_Box from "../../../utilities/Flex_Box";
import { generateRandomColor, light_theme } from "../../../utilities/colors";
import { getTags_api } from "../../../apis";
import { useDispatch, useSelector } from "react-redux";
import {
  set_loading_action,
  set_tags_action,
} from "../../../redux_prog/actions/base_action";
import { TAG_ICONS } from "../../../utilities/Icons";

const Cat_item = ({ item, navigation }) => {
  const { grey, text_color } = light_theme;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation?.navigate("Hop", {
          tag: item?.id,
          tagName: item?.tagName,
        });
      }}
      style={{
        marginRight: 15,
      }}
    >
      <Flex_Box
        style={{
          width: "",
          gap: 5,
        }}
      >
        <Flex_Box
          style={{
            backgroundColor: item?.backgroundColor,
            borderRadius: 50,
            height: 50,
            width: 50,
          }}
        >
          {/* <MaterialIcons name={item?.icon} size={30} color="#fff" /> */}
          <Image
                              source={TAG_ICONS[item?.icon]}
                              style={{
                                height:25,
                                width:25
                              }}
                              />
        </Flex_Box>
        <Text style={{ color: text_color }}>{item?.tagName}</Text>
      </Flex_Box>
    </TouchableOpacity>
  );
};

const Categories = ({ token, navigation }) => {
  // const [tags, settags] = useState([]);
  const { tags } = useSelector((state) => state?.baseReducer);
  const dispatch = useDispatch();

  const gettags = () => {
    dispatch(set_loading_action(true));
    getTags_api(token)
      .then((res) => {
        dispatch(set_loading_action(false));
        dispatch(set_tags_action(res.data.data.tags));
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.log(err);
      });
  };

  useEffect(gettags, []);
  const { grey, text_color } = light_theme;

  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      <Text style={{ fontWeight: 500, fontSize: 18, color: grey }}>
        {"Select Category"}
      </Text>
      <ScrollView horizontal={true}>
        <Flex_Box
          style={{
            justifyContent: "start",
            flexDirection: "row",
            marginVertical: 10,
            gap: 15,
            overFlow: "auto",
          }}
        >
          {tags?.length > 0 && (
            <FlatList
              horizontal={true}
              data={tags.slice(0, 10)}
              renderItem={({ item }) => {
                return <Cat_item navigation={navigation} item={item} />;
              }}
            />
          )}
        </Flex_Box>
      </ScrollView>
    </View>
  );
};

export default Categories;
