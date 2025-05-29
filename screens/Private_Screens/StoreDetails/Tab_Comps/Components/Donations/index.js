import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Flex_Box from "../../../../../../utilities/Flex_Box";
import { light_theme, theme_color } from "../../../../../../utilities/colors";
import {
  formatPostDeadline,
  get_meridian_time,
} from "../../../../../../utilities/Get_Meridian_Time";
import { Weekdays } from "../../../../../../utilities/WeekDays";
import Bottom_Modal from "../../../../../../utilities/Bottom_Modal";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { set_loading_action } from "../../../../../../redux_prog/actions/base_action";
import {
  donations_api,
  get_store_posts_api,
  get_store_products_api,
  like_store_post_api,
  show_post_interest_api,
} from "../../../../../../apis";
import Button_Comp from "../../../../../../utilities/Button_Comp";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import return_error from "../../../../../../utilities/Return_Error";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Add_Donation_Modal from "./Add_Donation_Modal";
import Form_Item from "../../../../../../utilities/Form_Item";
import { month_options } from "../../../../../../utilities/Month_options";
import { getYearList } from "../../../../../../utilities/Get_Years";
import validate_object from "../../../../../../utilities/Validate_object";
import Alert_comp from "../../../../../../utilities/Alert_comp";
import { screen_height } from "../../../../../../utilities/utilities";
import { TAG_ICONS } from "../../../../../../utilities/Icons";

const Donations = ({
  navigation,
  token,
  notTakenDonations,
  donations,
  tab_index,
}) => {
  const window_height = Dimensions.get("screen").height;
  const { text_color, green, dark_grey, light_grey, grey, pink } = light_theme;

  const isfocused = useIsFocused();
  const dispatch = useDispatch();
  const { params } = useRoute();

  const [open, setopen] = useState(false);
console.warn({
  donations,
  notTakenDonations
});

  const combined_arr = [...donations?.map((el)=>{
    return {
      ...el,
      icon:notTakenDonations?.filter((li)=>{
        return el.tag_name == li.tagName
      })[0]?.icon
    }
  }), ...notTakenDonations?.filter((el)=>{
    return donations?.map((li)=>{return li.tag_name})?.includes(el?.tagName) != true;
  })];

  const [modalVisible, setModalVisible] = useState(false);

  const [submitting, setsubmitting] = useState(false);

  const [donation_data, setdonation_data] = useState({
    amount: "",
    note: "",
    cardName: "",
    cardNumber: "",
    cardMonth: "",
    cardYear: "",
    cardCode: "",
    shopId: params?.id,
  });

  const { amount, note, cardName, cardNumber, cardMonth, cardYear, cardCode } =
    donation_data;

  const add_donations = () => {
    console.warn(donation_data);
    setsubmitting(true);
    const is_validated = validate_object(donation_data);
    if (is_validated?.status == true) {
      donations_api(donation_data, token)
        .then((res) => {
          if (res.data.status == true) {
            Alert_comp("Success", "Donated " + amount + "$ successfully!");
            setModalVisible(false);
          }
        })
        .catch((err) => {
          console.error(return_error(err));
        });
    } else {
      console.warn(is_validated);
    }
  };

  const upd_donation_data = (val_obj) => {
    setdonation_data({
      ...donation_data,
      ...val_obj,
    });
    setsubmitting(false);
  };

  return (
    <>
      {/* <View> */}
      <Button_Comp
        label={"Donate Money"}
        btn_style={{
          borderColor: theme_color,
          borderWidth: 2,
          marginTop: 8,
          backgroundColor: "#FFF",
          paddingVertical: 10,
        }}
        text_style={{
          color: theme_color,
        }}
        onClick={() => {
          setModalVisible(true);
        }}
      />

      <View
        style={{
          // height: 330,
          flex: 1,
          // backgroundColor: "red",
          paddingBottom: 17,
        }}
      >
        {combined_arr?.length > 0 && (
          <FlatList
            // contentContainerStyle={{
            //   flex: 1,
            // }}
            data={combined_arr}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <Flex_Box
                  style={{
                    borderBottomColor: grey,
                    borderBottomWidth: 1,
                    paddingVertical: 10,
                    flexDirection: "row",
                    justifyContent: "start",
                  }}
                >
                  <Flex_Box
                    style={{
                      backgroundColor: item?.backgroundColor || "#000",
                      borderRadius: 50,
                      height: 40,
                      width: 40,
                    }}
                  >
                    {/* {
                      <MaterialIcons
                      name={item?.icon || "do-not-disturb"}
                      size={25}
                      color="#fff"
                    />
                     ||
                    <MaterialCommunityIcons
                    name={item?.icon || "do-not-disturb"}
                    size={25}
                    color="#fff"
                    />
                    } */}

                    <Image
                    source={TAG_ICONS[item?.icon]}
                    style={{
                      height:20,
                      width:20
                    }}
                    />
                  </Flex_Box>

                  <TouchableOpacity
                    onPress={() => {
                      console.warn(item);
                    }}
                    style={{
                      backgroundColor: light_grey,
                      borderRadius: 5,
                      padding: 5,
                      flexWrap: "wrap",
                      width: "",
                      marginLeft: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: item?.tag_name ? dark_grey : pink,
                      }}
                    >
                      {item?.tag_name ? "Taken" : "Not Taken"}
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: text_color,
                      marginLeft: 15,
                    }}
                  >
                    {item?.tag_name || item?.tagName}
                  </Text>
                </Flex_Box>
              );
            }}
          />
        )}
        {combined_arr?.length == 0 && (
          <Text
            style={{
              color: "#000",
              textAlign: "center",
            }}
          >
            Nothing to show here at the moment
          </Text>
        )}
      </View>
      {/* </View> */}
      <Add_Donation_Modal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        label={"Add Donation"}
      >
        <Flex_Box
          style={{
            paddingHorizontal: 15,
            paddingTop: 15,
            paddingBottom: 5,
            gap: 20,
            // flex: 1,
          }}
        >
          <Form_Item
            keyboardType={"numeric"}
            value={amount}
            onchange={(e) => {
              upd_donation_data({
                amount: e,
              });
            }}
            label={"Amount"}
            placeholder={"Enter amount"}
            error={!amount && submitting}
          />
          <Form_Item
            label={"Note"}
            value={note}
            onchange={(e) => {
              upd_donation_data({
                note: e,
              });
            }}
            placeholder={"Enter note"}
            error={!note && submitting}
          />
          <Form_Item
            label={"Name on Card"}
            placeholder={"Enter Name on Card"}
            value={cardName}
            onchange={(e) => {
              upd_donation_data({
                cardName: e,
              });
            }}
            error={!cardName && submitting}
          />
          <Form_Item
            label={"Card Number"}
            placeholder={"Enter Card Number"}
            value={cardNumber}
            keyboardType={"numeric"}
            onchange={(e) => {
              upd_donation_data({
                cardNumber: e,
              });
            }}
            error={!cardNumber && submitting}
          />
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Form_Item
              style={{
                width: "48%",
              }}
              label={"Expiry Month"}
              select={true}
              select_arr={month_options}
              value={cardMonth ? month_options[cardMonth - 1] : null}
              onchange={(e) => {
                upd_donation_data({
                  cardMonth: e.value,
                });
              }}
              error={!cardMonth && submitting}
            />
            <Form_Item
              style={{
                width: "48%",
              }}
              label={"Expiry Year"}
              select={true}
              select_arr={getYearList()}
              value={
                cardYear
                  ? getYearList().filter((el) => {
                      return el.value == cardYear;
                    })
                  : null
              }
              onchange={(e) => {
                upd_donation_data({
                  cardYear: e.value,
                });
              }}
              error={!cardYear && submitting}
            />
          </Flex_Box>
          <Form_Item
            label={"Card Code (CVC)"}
            placeholder={"Enter CVC"}
            keyboardType={"numeric"}
            value={cardCode}
            onchange={(e) => {
              upd_donation_data({
                cardCode: e,
              });
            }}
            error={!cardCode && submitting}
          />
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 20,
            }}
          >
            <Button_Comp
              label={"Donate Money"}
              btn_style={{
                width: "",
                paddingVertical: 12,
                paddingHorizontal: 15,
                borderRadius: 5,
              }}
              onClick={add_donations}
            />
            <Button_Comp
              label={"Cancel"}
              btn_style={{
                width: "",
                paddingVertical: 12,
                paddingHorizontal: 15,
                borderRadius: 5,
                backgroundColor: light_grey,
              }}
              text_style={{
                color: theme_color,
              }}
              onClick={() => {
                setModalVisible(false);
              }}
            />
          </Flex_Box>
        </Flex_Box>
      </Add_Donation_Modal>
    </>
  );
};

export default Donations;
