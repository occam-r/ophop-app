import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Modal_Comp from "../../../../../../../utilities/Modal_Comp";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Flex_Box from "../../../../../../../utilities/Flex_Box";
import {
  light_theme,
  theme_color,
} from "../../../../../../../utilities/colors";
import { useSelector } from "react-redux";
import { rate_store_api } from "../../../../../../../apis";
import Alert_comp from "../../../../../../../utilities/Alert_comp";
import return_error from "../../../../../../../utilities/Return_Error";
import Button_Comp from "../../../../../../../utilities/Button_Comp";

const Add_Review = ({
  modalVisible,
  setmodalVisible,
  set_r_data,
  r_data,
  store_details,
  get_store_details
}) => {
  const [rating, setrating] = useState(5);
  const { token } = useSelector((state) => state?.authReducer);

  const rate_store = () => {
    rate_store_api(
      store_details?.id,
      {
        userRating: rating,
      },
      token
    )
      .then((res) => {
        if (res.data.status == true) {
          Alert_comp("Success", "Added review successfully!");
          get_store_details();
          // set_r_data([
          //   {
          //     id: 6,
          //     userName: store_details?.shopName,
          //     rating,
          //     avatarBackground: "hsla(22,100%,38%,1)",
          //   },
          //   ...r_data,
          // ]);
        }
        setmodalVisible(false);
      })
      .catch((err) => {
        setmodalVisible(false);
        console.log(err);
        Alert_comp(return_error(err));
      });
  };

  const { light_grey, grey, backgroundColor } = light_theme;

  return (
    <Modal_Comp
      modalVisible={modalVisible}
      setModalVisible={setmodalVisible}
      label={"How was your Experience with " + store_details?.shopName}
    >
      <Flex_Box
        style={{
          flexDirection: "row",
          // justifyContent: "start",
          gap: 10,
          paddingTop: 7,
          // paddingLeft: 15
        }}
      >
        {[1, 2, 3, 4, 5].map((el, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setrating(el);
              }}
            >
              <FontAwesome
                name="star"
                size={25}
                color={el <= rating ? "gold" : grey}
              />
            </TouchableOpacity>
          );
        })}
      </Flex_Box>
      <Flex_Box
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15,
          paddingHorizontal: 15,
        }}
      >
        <Button_Comp
          label={"Submit"}
          btn_style={{
            paddingVertical: 10,
            borderRadius: 8,
            width: "48%",
          }}
          onClick={() => {
            rate_store();
          }}
        />
        <Button_Comp
          label={"Cancel"}
          btn_style={{
            paddingVertical: 8,
            borderRadius: 8,
            width: "48%",
            borderWidth: 2,
            borderColor: theme_color,
            backgroundColor,
          }}
          text_style={{
            color: theme_color,
          }}
          onClick={() => {
            setmodalVisible(false);
          }}
        />
      </Flex_Box>
    </Modal_Comp>
  );
};

export default Add_Review;
