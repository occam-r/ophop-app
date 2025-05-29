import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import Store_Item from "./Store_Item";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";

const MyHop = ({ navigation,setroute_shop }) => {
  const { routes } = useSelector((state) => state?.authReducer);

  return (
    <View
      style={{
        paddingTop: 10,
        paddingBottom: 60,
      }}
    >
      {
        // route_shop &&
        <ScrollView>
          {routes?.length > 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={routes}
              renderItem={({ item, index }) => {
                return (
                  <Store_Item
                    navigation={navigation}
                    my_hop={true}
                    isclosest={index == 0}
                    item={item}
                    setroute_shop={setroute_shop}
                  />
                );
              }}
            />
          )}
          {
            routes?.length == 0 &&
            <Text
            style={{
              color:"#000",
              textAlign:"center"
            }}
            >
              You have no stores in your hop yet. Add Some
            </Text>
           }
        </ScrollView>
      }
    </View>
  );
};

export default MyHop;
