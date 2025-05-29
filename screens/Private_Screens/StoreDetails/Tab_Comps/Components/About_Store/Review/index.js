import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Flex_Box from "../../../../../../../utilities/Flex_Box";
import {
  light_theme,
  theme_color,
} from "../../../../../../../utilities/colors";
import {
  formatPostDeadline,
  get_meridian_time,
} from "../../../../../../../utilities/Get_Meridian_Time";
import { Weekdays } from "../../../../../../../utilities/WeekDays";
import Bottom_Modal from "../../../../../../../utilities/Bottom_Modal";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { set_loading_action } from "../../../../../../../redux_prog/actions/base_action";
import {
  donations_api,
  get_store_posts_api,
  get_store_products_api,
  like_store_post_api,
  show_post_interest_api,
} from "../../../../../../../apis";
import Button_Comp from "../../../../../../../utilities/Button_Comp";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import return_error from "../../../../../../../utilities/Return_Error";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import Add_Donation_Modal from "./Add_Donation_Modal";
import Form_Item from "../../../../../../../utilities/Form_Item";
import { month_options } from "../../../../../../../utilities/Month_options";
import { getYearList } from "../../../../../../../utilities/Get_Years";
import validate_object from "../../../../../../../utilities/Validate_object";
import Alert_comp from "../../../../../../../utilities/Alert_comp";
import { getUserInitials } from "../../../../../../../utilities/utilities";
import Add_Review from "./Add_Review";

const Reviews = ({ store_details,get_store_details }) => {
  const reviews = store_details?.reviews;
  const [r_data, setr_data] = useState(reviews);
  const { text_color, green, dark_grey, light_grey, grey, pink } = light_theme;

  const [modalVisible, setModalVisible] = useState(false);
  const [item_data, setitem_data] = useState({});

  return (
    <>
      <View>
        <Text
          style={{
            color: text_color,
            fontWeight: 500,
            fontSize: 16,
          }}
        >
          Reviews
        </Text>
        <Button_Comp
          label={"Add Review"}
          btn_style={{
            borderColor: theme_color,
            borderWidth: 2,
            marginTop: 8,
            borderRadius: 8,
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
            paddingBottom: 8,
          }}
        >
          {r_data?.length > 0 && (
            <FlatList
              data={r_data}
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
                        backgroundColor: item?.avatarBackground,
                        borderRadius: 50,
                        height: 40,
                        width: 40,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 600,
                          fontSize: 18,
                        }}
                      >
                        {getUserInitials(item?.userName)}
                      </Text>
                    </Flex_Box>

                    <Flex_Box
                      style={{
                        // backgroundColor: light_grey,
                        // borderRadius: 5,
                        alignItems: "start",
                        padding: 5,
                        // flexWrap: "wrap",
                        // width: "60%",
                        marginLeft: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: dark_grey,
                        }}
                      >
                        {item?.userName}
                      </Text>
                      <Flex_Box
                        style={{
                          flexDirection: "row",
                          gap: 3,
                          justifyContent: "start",
                        }}
                      >
                        <FontAwesome6 name="star" size={13} color="gold" />
                        <Text style={{ color: text_color }}>
                          {item?.rating}
                        </Text>
                      </Flex_Box>
                    </Flex_Box>
                  </Flex_Box>
                );
              }}
            />
          )}
        </View>
      </View>

      <Add_Review
        modalVisible={modalVisible}
        setmodalVisible={setModalVisible}
        r_data={r_data}
        set_r_data={setr_data}
        store_details={store_details}
        item_data={item_data}
        setitem_data={setitem_data}
        get_store_details={get_store_details}
      />

      {/* <Add_Donation_Modal
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
              label={"Donate"}
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
      </Add_Donation_Modal> */}
    </>
  );
};

export default Reviews;
