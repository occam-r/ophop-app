import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Sidebar_Toggle_Bar } from "../../Sidebar/Sidebar_Toggle";
import { light_theme } from "../../../utilities/colors";
import { useSelector } from "react-redux";
import Store_Item from "../../../utilities/Store_Item";
import BottomBar from "../../BottomBar";
import Nav_Filter from "./Nav_Filter";
import { Not_Found_Text } from "../../../utilities/utilities";

const Recently_visited = ({ navigation }) => {
  const { backgroundColor } = light_theme;
  const { city_details, nearby_shops } = useSelector(
    (state) => state?.baseReducer
  );

  const { routes } = useSelector((state) => state?.authReducer);
  const my_hop_ids = routes?.map((el) => {
    return el.id;
  });

  const { visited } = city_details || {};
  const [open_search, setopen_search] = useState(false);
  const [search_text, setsearch_text] = useState("");
  const [filtered_arr, setfiltered_arr] = useState([]);

  useEffect(() => {
    if (search_text) {
      const new_arr = visited?.filter((item) => {
        const store_data = nearby_shops?.filter((el) => {
          return el?.id == item?.shopId;
        })[0];
        return JSON.stringify(store_data?.storeName)
          ?.toLowerCase()
          ?.includes(search_text?.toLowerCase());
      });

      setfiltered_arr(new_arr);
    } else {
      setfiltered_arr([]);
    }
  }, [search_text]);

  return (
    <>
      <Sidebar_Toggle_Bar
        func={() => {
          navigation.goBack();
        }}
        sub_route={true}
        label={"Recently Visited"}
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
          flex: 1,
          backgroundColor,
          paddingHorizontal: 5,
          paddingBottom: 60,
        }}
      >
        {visited?.length == 0 && (
        <Not_Found_Text text={`You have no visited stores!`} />
      )}
        {visited?.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const store_data = nearby_shops?.filter((el) => {
                return el?.id == item?.shopId;
              });
              return (
                <Store_Item
                  item={store_data[0] || {}}
                  navigation={navigation}
                  my_hop={my_hop_ids?.includes(item?.shopId)}
                />
              );
            }}
            data={open_search ? filtered_arr : visited}
          />
        )}
      </View>
      <BottomBar navigation={navigation} />
    </>
  );
};

export default Recently_visited;
