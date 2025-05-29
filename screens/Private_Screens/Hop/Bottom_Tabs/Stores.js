import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import Store_Item from "./Store_Item";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";

const Stores = ({ navigation,setroute_shop }) => {
  const { nearby_shops } = useSelector((state) => state?.baseReducer);
  const { routes } = useSelector((state) => state?.authReducer);
  const params = useRoute();

  const r_arr = routes?.map((el) => {
    return el?.id;
  });

  const filtrered_shops = nearby_shops?.filter((el) => {
    if (params?.params?.tag) {
      return el.tags?.includes(params?.params?.tag);
    } else {
      return el;
    }
  });

  return (
    <View
      style={{
        paddingBottom: 60,
        // height:100
      }}
    >
      <ScrollView>
        {filtrered_shops?.length > 0 && (
          <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
            data={filtrered_shops}
            renderItem={({ item, index }) => {
              return (
                <Store_Item
                  navigation={navigation}
                  my_hop={r_arr?.includes(item?.id)}
                  // isclosest={index==0}
                  item={item}
                  setroute_shop={setroute_shop}
                />
              );
            }}
          />
        )}
        {
            filtrered_shops?.length == 0 &&
            <Text
            style={{
              color:"#000",
              textAlign:"center"
            }}
            >
              Nothing to show here at the moment
            </Text>
           }
      </ScrollView>
    </View>
  );
};

export default Stores;
