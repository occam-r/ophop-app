import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Sidebar_Toggle_Bar } from "../../../Sidebar/Sidebar_Toggle";
import Flex_Box from "../../../../utilities/Flex_Box";
import { light_theme } from "../../../../utilities/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Nav_Filter from "../Nav_Filter";
import { get_orders_api } from "../../../../apis";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { Not_Found_Text } from "../../../../utilities/utilities";

const OrderHistory = ({ navigation }) => {
  const { backgroundColor, text_color, grey } = light_theme;
  const IsFocused = useIsFocused();
  const [open_search, setopen_search] = useState(false);
  const [search_text, setsearch_text] = useState("");
  const [order_arr, setorder_arr] = useState([]);
  const [filtered_arr, setfiltered_arr] = useState([]);

  const { token } = useSelector((state) => state?.authReducer);

  const get_orders = () => {
    get_orders_api(token)
      .then((res) => {
        console.warn(res.data.data.orders);
        setorder_arr(res.data.data.orders);
      })
      .catch((err) => {
        console.error(err)
      });
  };

  useEffect(get_orders, [IsFocused]);

  useEffect(() => {
    if (search_text) {
      const new_arr = order_arr?.filter((item) => {
       return JSON.stringify(item?.code)
          ?.toLowerCase()
          ?.includes(search_text?.toLowerCase());
      });

      setfiltered_arr(new_arr);
    } else {
      setfiltered_arr([]);
    }
  }, [search_text]);

  const o_arr = search_text ? filtered_arr : order_arr;

  return (
    <>
      <Sidebar_Toggle_Bar
        func={() => {
          navigation?.goBack();
        }}
        label={"Order History"}
        sub_route={true}
        suffix={
          <Nav_Filter
            open_search={open_search}
            setopen_search={setopen_search}
            search_text={search_text}
            setsearch_text={setsearch_text}
          />
        }
      />
      <View
        style={{
          //   marginTop: 15,
          backgroundColor,
          flex: 1,
          // height: screen_height - 100,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {o_arr?.length > 0 && (
            <FlatList
              data={o_arr}
              renderItem={({ item }) => {
                return (
                  <Flex_Box
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                      backgroundColor,
                      borderBottomWidth: 1,
                      borderBottomColor: grey,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: text_color,
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                      >
                        {`Order #` + item.code}
                      </Text>
                      <Text
                        style={{
                          color: text_color,
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {item.createdAt}
                      </Text>
                      <Text
                        style={{
                          color: text_color,
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {`$` + item?.total}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        navigation?.navigate("Order Details", {
                          id: item?.id,
                          address:item?.address
                        });
                      }}
                    >
                      <MaterialIcons name="preview" size={40} color="#000" />
                    </TouchableOpacity>
                  </Flex_Box>
                );
              }}
            />
          )}
          {
            o_arr?.length==0 &&
              <Not_Found_Text text={`You have no orders. Add some!`} />
          }
        </ScrollView>
      </View>
    </>
  );
};

export default OrderHistory;
