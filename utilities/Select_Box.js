import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { dark_theme, light_theme, theme_color } from "./colors";
import CheckBox from "react-native-check-box";
import Flex_Box from "./Flex_Box";
import Button_Comp from "./Button_Comp";
import Form_Item from "./Form_Item";
import SelectDropdown from "react-native-select-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  formatDistance,
  getDistanceBetweenTwoPoints,
  openGoogleMapsNavigation,
} from "./Map_utils";
import { set_routes_action } from "../redux_prog/actions/auth_action";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { truncateLongShopName } from "./utilities";
import { STORAGE_URL } from "../apis/config";
import Store_Item from "./Store_Item";

const Select_Modal = ({
  options,
  value,
  onChange,
  modalVisible,
  setModalVisible,
  isMulti,
  element,
  navigation,
  hop_search,
  tag,
  tagName,
}) => {
  const windowHeight = Dimensions.get("window").height;

  const theme = useSelector((state) => state?.themeReducer?.theme);
  const theme_config = theme == "light" ? light_theme : dark_theme;
  const { text_color, backgroundColor, shadowColor, grey } = theme_config;
  const [multi_Selected_arr, setmulti_Selected_arr] = useState(value || []);

  const select_multi = (e) => {
    const st_arr = multi_Selected_arr || [];
    if (st_arr?.includes(e?.value)) {
      const new_arr = st_arr?.filter((el) => {
        return e?.value != el;
      });
      setmulti_Selected_arr(new_arr);
    } else {
      const new_arr = [...st_arr, e?.value];
      setmulti_Selected_arr(new_arr);
    }
  };

  const [filter_val, setfilter_val] = useState("");
  const [options_arr, setoptions_arr] = useState([]);

  useEffect(() => {
    if (modalVisible == true) {
      setmulti_Selected_arr(value || []);
    }
  }, [modalVisible]);

  useEffect(() => {
    if (filter_val) {
      if (hop_search) {
        setoptions_arr(
          options?.filter((el) => {
            return el.label.toLowerCase().includes(filter_val.toLowerCase());
          })
        );
      } else {
        setoptions_arr(
          options?.filter((el) => {
            return el.label.toLowerCase().includes(filter_val.toLowerCase());
          })
        );
      }
    } else {
      setoptions_arr(options);
    }
  }, [filter_val, modalVisible]);

  const [selected_tag, setselected_tag] = useState(null);

  useEffect(() => {
    if (tag) {
      setselected_tag(tag);
      setfilter_val(tagName);
      console.warn({ tag, tagName });
    }
  }, [tag]);
  const [donations_tag, setdonations_tag] = useState(null);

  const { nearby_shops } = useSelector((state) => state?.baseReducer);
  const { routes } = useSelector((state) => state?.authReducer);
  const route_ids = routes?.map((el) => {
    return el?.id;
  });

  const shop_arr =
    (filter_val || selected_tag) &&
    nearby_shops?.length > 0 &&
    nearby_shops?.filter((el) => {
      if (donations_tag?.value != "Donations") {
        return (
          el?.tags?.filter((li) => {
            return li?.toLowerCase()?.includes(filter_val?.toLowerCase());
          })?.length > 0 ||
          el?.location?.suburbName
            ?.toLowerCase()
            ?.includes(filter_val?.toLowerCase()) ||
          el?.storeName?.toLowerCase()?.includes(filter_val?.toLowerCase()) ||
          el?.tags?.includes(selected_tag)
        );
      } else {
        return (
          el?.donations?.filter((li) => {
            return li?.toLowerCase()?.includes(filter_val?.toLowerCase());
          })?.length > 0 ||
          el?.location?.suburbName
            ?.toLowerCase()
            ?.includes(filter_val?.toLowerCase()) ||
          el?.storeName?.toLowerCase()?.includes(filter_val?.toLowerCase()) ||
          el?.donations?.includes(selected_tag)
        );
      }
    });

  return (
    <>
      {element}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}
      >
        <View
          style={{
            flex: 1,
            backgroundColor,
            padding: 20,
            paddingLeft: 0,
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              width: "100%",
              gap: 20,
            }}
          >
            <SelectDropdown
              defaultValue={
                donations_tag || {
                  label: "All",
                  value: "All",
                }
              }
              data={[
                {
                  label: "All",
                  value: "All",
                },
                {
                  label: "Donations",
                  value: "Donations",
                },
              ]}
              onSelect={(selectedItem, index) => {
                setdonations_tag(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // The text to show after item is selected
                const don_dots = selectedItem?.label == "Donations" ? ".." : "";
                return selectedItem.label?.slice(0, 3) + don_dots + "▼";
              }}
              rowTextForSelection={(item, index) => {
                // The text to show in dropdown list
                return item.label;
              }}
              buttonStyle={{
                backgroundColor: backgroundColor,
                height: 40,
                width: 90,
                // marginLeft:-10
              }}
              buttonTextStyle={{ color: text_color, fontSize: 16 }}
              dropdownStyle={{
                backgroundColor: backgroundColor,
                borderRadius: 5,
                width: 100,
              }}
              rowTextStyle={{ color: text_color }}
              dropdownTextStyle={{ color: text_color }}
            />
            <View
              style={{
                width: "60%",
                backgroundColor: "#c9c9c9",
                height: 45,
                borderRadius: 7,
                display: "flex",
                justifyContent: "start",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                gap: 5,
                marginLeft: -30,
              }}
            >
              <Image
                source={require("../images/search.png")}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
              <TextInput
                style={{
                  width: "90%",
                  color: text_color,
                }}
                value={filter_val}
                onChangeText={(e) => {
                  setfilter_val(e);
                  setselected_tag(null);
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Image
                source={require("../images/cross.png")}
                style={{
                  height: 28,
                  width: 28,
                  backgroundColor: "#fff",
                  borderRadius: 50,
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: windowHeight - 80,
              width: "100%",
              paddingLeft: 20,
            }}
          >
            {!selected_tag && !filter_val && options_arr?.length > 0 && (
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={options_arr}
                renderItem={({ item }) => {
                  const el = item;
                  return (
                    <TouchableOpacity
                      // key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        width: "100%",
                        paddingLeft: 15,
                        paddingRight: 25,
                        paddingVertical: 22,
                        borderBottomColor: text_color,
                        borderBottomWidth: 0.5,
                      }}
                      onPress={() => {
                        // if (isMulti) {
                        //   select_multi(el);
                        // } else {
                        //   onChange(el);
                        //   setModalVisible(false);
                        // }

                        setselected_tag(el.value);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          color: text_color,
                          width: "80%",
                        }}
                      >
                        {el?.label}
                      </Text>
                      {isMulti && (
                        <CheckBox
                          onClick={() => {
                            select_multi(el);
                          }}
                          isChecked={multi_Selected_arr?.includes(el?.value)}
                          checkBoxColor={text_color}
                          checkedCheckBoxColor={theme_color}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => item.value}
              />
            )}
            {(selected_tag || filter_val) && shop_arr?.length > 0 && (
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={shop_arr}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      <Store_Item
                        item={item}
                        isclosest={index == 0}
                        navigation={navigation}
                        setModalVisible={setModalVisible}
                      />
                    </>
                  );
                }}
              />
            )}
          </View>
          <Flex_Box>
          </Flex_Box>
        </View>
      </Modal>
    </>
  );
};

export default Select_Modal;
