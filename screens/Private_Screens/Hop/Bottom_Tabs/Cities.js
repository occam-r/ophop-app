import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import {
  light_theme,
  light_theme_bg,
  theme_color,
} from "../../../../utilities/colors";
import Flex_Box from "../../../../utilities/Flex_Box";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { formatDistance, getDistanceBetweenTwoPoints } from "../../../../utilities/Map_utils";
import { set_city_details_action } from "../../../../redux_prog/actions/base_action";
import { get_city_details_api } from "../../../../apis";
import return_error from "../../../../utilities/Return_Error";

const City_comp = ({ item }) => {
  const { grey, text_color } = light_theme;
  const { current_location,city_details } = useSelector((state) => state?.baseReducer);
  const { token } = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();
  const { longitude, latitude } = current_location;

const get_city_details = (el)=>{
get_city_details_api(el?.id, token)
      .then((res) => {
        dispatch(set_city_details_action({city_data:el,...res.data.data}));
        // console.warn("=====>"+JSON.stringify({...city_details,...res.data.data}));
      })
      .catch((err) => {
        console.error(return_error(err));
      });
}
  
  return (
    <TouchableOpacity
      style={{
        backgroundColor: light_theme_bg,
        borderRadius: 10,
        padding: 8,
        marginTop:10
      }}
      onPress={()=>{
        get_city_details(item)
      }}
    >
      <Text
        style={{
          fontWeight: 500,
          fontSize: 16,
          color: theme_color,
        }}
      >
        {item?.cityName}
      </Text>
      <Text
        style={{
          fontWeight: 500,
          color: grey,
          marginTop: 1,
        }}
      >
        {item?.country}
      </Text>
      <Flex_Box
        style={{
          flexDirection: "row",
          gap: 20,
          justifyContent: "start",
          marginTop: 5,
        }}
      >
        <Flex_Box
          style={{
            width: "",
            flexDirection: "row",
            justifyContent: "start",
            gap: 5,
          }}
        >
          <FontAwesome6 name="shop" size={15} color={theme_color} />
          <Text style={{ color: text_color }}>{item?.shopsInCity} Stores</Text>
        </Flex_Box>
        <Flex_Box
          style={{
            width: "",
            flexDirection: "row",
            justifyContent: "start",
            gap: 5,
          }}
        >
          <FontAwesome name="send" size={15} color={text_color} />
          <Text style={{ color: text_color }}>
          {formatDistance(
              getDistanceBetweenTwoPoints(
                {
                  lat: parseFloat(item?.location?.lat),
                  lng: parseFloat(item?.location?.lng),
                },
                {
                  lat: parseFloat(latitude),
                  lng: parseFloat(longitude),
                }
              )
            )}
          </Text>
        </Flex_Box>
      </Flex_Box>
    </TouchableOpacity>
  );
};

const Cities = () => {
  const { grey, text_color } = light_theme;
  const { city_data } = useSelector((state) => state?.baseReducer);

  return (
    <View
      style={{
        paddingTop: 10,
        paddingBottom: 60,
      }}
    >
      <Text style={{ color: grey, fontWeight: 600, fontSize: 18 }}>
        Select Cities
      </Text>

      {city_data?.length > 0 && (
        <FlatList
          data={city_data}
          renderItem={({ item }) => {
            console.warn(item);
            return <City_comp item={item} />;
          }}
        />
      )}
    </View>
  );
};

export default Cities;
