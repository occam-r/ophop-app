import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { light_theme, theme_color } from "../../../utilities/colors";
import Flex_Box from "../../../utilities/Flex_Box";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Button_Comp from "../../../utilities/Button_Comp";
import Modal_Comp from "../../../utilities/Modal_Comp";
import { useDispatch, useSelector } from "react-redux";
import { getUserInitials } from "../../../utilities/utilities";
import { actions_api, messages_api, report_api } from "../../../apis";
import return_error from "../../../utilities/Return_Error";
import Alert_comp from "../../../utilities/Alert_comp";
import { set_loading_action } from "../../../redux_prog/actions/base_action";
import Form_Item from "../../../utilities/Form_Item";

const Report_Modal = ({ additional_shop_data }) => {
  const { text_color, grey, green, backgroundColor, light_grey, dark_grey } =
    light_theme;

  const [modalVisible, setmodalVisible] = useState(false);
  const { user_data, token } = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();

  const getReasonList = [
    { value: "1", label: "Inaccurate Information" },
    { value: "2", label: "Store no longer exists" },
    { value: "3", label: "Something else" },
  ];

  const [report_data, setreport_data] = useState({
    description: "",
    reasonId: "0",
  });

  const { description, reasonId } = report_data;

  const upd_rep_data = (obj) => {
    setreport_data({
      ...report_data,
      ...obj,
    });
  };

  const submit_report = () => {
    if (reasonId > 0) {
      dispatch(set_loading_action(true));
      report_api(additional_shop_data?.id, report_data, token)
        .then((res) => {
          if (res.data.status == true) {
            Alert_comp("Success", "Report submitted successfully!");
          }
          dispatch(set_loading_action(false));
          setmodalVisible(false);
        })
        .catch((err) => {
          console.error(return_error(err));
        });
    } else {
      dispatch(set_loading_action(false));
      Alert_comp("Error", "Please select a valid reason!");
    }
  };

  return (
    <>
      <Button_Comp
        btn_style={{
          backgroundColor,
          borderWidth: 1,
          borderColor: theme_color,
          width: 100,
          height: 40,
          paddingVertical: 0,
          borderRadius: 8,
        }}
        text_style={{
          color: theme_color,
          fontSize: 16,
        }}
        label={"Report"}
        onClick={() => {
          setmodalVisible(true);
        }}
      />
      <Modal_Comp
        modalVisible={modalVisible}
        setModalVisible={setmodalVisible}
        label={"Report"}
      >
        <View
          style={{
            paddingHorizontal: 15,
          }}
        >
          <Form_Item
            label={"Reason"}
            placeholder={"Select.."}
            select={true}
            select_arr={getReasonList}
            value={getReasonList[reasonId - 1] || ""}
            onchange={(e) => {
              upd_rep_data({
                reasonId: e.value,
              });
            }}
          />
          <Form_Item
            label={"Please describe the issue below"}
            placeholder={"Enter.."}
            style={{
              marginTop: 10,
            }}
            input_style={{
              height: 100,
            }}
            value={description}
            onchange={(e) => {
              upd_rep_data({
                description: e,
              });
            }}
          />
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
              marginTop: 10,
            }}
          >
            <Button_Comp
              btn_style={{
                width: "48%",
                paddingVertical: 15,
              }}
              label={"Submit"}
              onClick={submit_report}
            />
            <Button_Comp
              btn_style={{
                width: "48%",
                paddingVertical: 13,
                backgroundColor,
                borderColor: theme_color,
                borderWidth: 2,
              }}
              text_style={{
                color: theme_color,
              }}
              label={"Cancel"}
              onClick={() => {
                setmodalVisible(false);
              }}
            />
          </Flex_Box>
        </View>
      </Modal_Comp>
    </>
  );
};

export default Report_Modal;
