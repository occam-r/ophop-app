import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Sidebar_Toggle } from "../../Sidebar/Sidebar_Toggle";
import Scroll_Comp from "../../../utilities/Scroll_Comp";
import Store_preview from "./Store_preview";
import Tab_Comps from "./Tab_Comps";
import BottomBar from "../../BottomBar";
import { light_theme } from "../../../utilities/colors";
import Flex_Box from "../../../utilities/Flex_Box";
import Entypo from "react-native-vector-icons/Entypo";
import MessageModal from "./MessageModal";
import { get_shop_activity_api } from "../../../apis";
import { useSelector } from "react-redux";

const StoreDetails = ({ navigation }) => {
  const [store_details, setstore_details] = React.useState({});
  const { dark_grey } = light_theme;
  const { routes, token } = useSelector((state) => state?.authReducer);

  

  return (
    <>
      <Scroll_Comp
        view_style={{
          padding: 20,
          flex: 1,
          position: "relative",
        }}
      >
        <Store_preview
          store_details={store_details}
          setstore_details={setstore_details}
          navigation={navigation}
        />
        <Tab_Comps
          store_details={store_details}
          setstore_details={setstore_details}
        />
        <MessageModal navigation={navigation} store_details={store_details} />
        
      </Scroll_Comp>
      <BottomBar navigation={navigation} />
    </>
  );
};

export default StoreDetails;
