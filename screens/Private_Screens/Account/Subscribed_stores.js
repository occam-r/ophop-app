import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Sidebar_Toggle_Bar } from "../../Sidebar/Sidebar_Toggle";
import { light_theme } from "../../../utilities/colors";
import { useDispatch, useSelector } from "react-redux";
import Store_Item from "../../../utilities/Store_Item";
import BottomBar from "../../BottomBar";
import { get_city_details_api } from "../../../apis";
import { set_city_details_action } from "../../../redux_prog/actions/base_action";
import { useIsFocused } from "@react-navigation/native";
import return_error from "../../../utilities/Return_Error";
import Nav_Filter from "./Nav_Filter";
import { Not_Found_Text } from "../../../utilities/utilities";

const Subscribed_stores = ({ navigation }) => {
  const IsFocused = useIsFocused();
  const { token } = useSelector((state) => state?.authReducer);
  const { city_data } = useSelector((state) => state?.baseReducer);
  const dispatch = useDispatch();
  const { backgroundColor } = light_theme;
  const { city_details, nearby_shops } = useSelector(
    (state) => state?.baseReducer
  );

  const { routes } = useSelector((state) => state?.authReducer);
  const my_hop_ids = routes?.map((el) => {
    return el.id;
  });
  const [open_search, setopen_search] = useState(false);
  const [search_text, setsearch_text] = useState("");
  const [filtered_arr, setfiltered_arr] = useState([]);

  console.warn(JSON.stringify(city_details?.subscribed));
  
const [subscribed_arr, setsubscribed_arr] = useState([]);
  const { subscribed } = city_details || {};

  const get_city_details = () => {
    get_city_details_api(city_details?.city_data?.id, token)
      .then((res) => {
        // dispatch(set_city_details_action(res.data.data));
        dispatch(set_city_details_action({
                  city_data:city_details?.city_data,
                  ...res.data.data}));
      })
      .catch((err) => {
        console.error(return_error(err));
      });
  };

  useEffect(get_city_details, [IsFocused]);
  // useEffect(() => {
  //   const new_arr = nearby_shops?.filter((item) => {
  //     const store_data = subscribed?.filter((el) => {
  //       return item?.id == el?.shopId;
  //     });
  //     return store_data?.length>0;
  //   });
  //   console.warn({new_arr});
    
  //   setsubscribed_arr(new_arr);
  // }, [subscribed,nearby_shops])
  

  useEffect(() => {
    if (search_text) {
      const new_arr =subscribed?.filter((item) => {
        const store_data = nearby_shops?.filter((el) => {
          return el?.id == item?.shopId;
        })[0]||{};
        return JSON.stringify(store_data?.storeName)
          ?.toLowerCase()
          ?.includes(search_text?.toLowerCase());
      });

      setfiltered_arr(new_arr);
    } else {
      setfiltered_arr([]);
      
    }
  }, [search_text]);

  // console.warn(JSON.stringify(city_details?.city_data));
  

 

  return (
    <>
      <Sidebar_Toggle_Bar
        func={() => {
          navigation.goBack();
        }}
        sub_route={true}
        label={"Subscribed Stores"}
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
        {subscribed?.length == 0 && (
          <Not_Found_Text text={`You have no subscribed stores. Add some!`} />
        )}
        {subscribed?.length > 0 && (
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
                  subscribe_btn={true}
                  func={get_city_details}
                />
              );
            }}
            data={open_search ? filtered_arr : subscribed}
          />
        )}
      </View>
      <BottomBar navigation={navigation} />
    </>
  );
};

export default Subscribed_stores;
