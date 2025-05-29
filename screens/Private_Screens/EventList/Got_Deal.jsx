import React, { useState } from "react";
import Modal_Comp from "../../../utilities/Modal_Comp";
import { light_theme, theme_color } from "../../../utilities/colors";
import Button_Comp from "../../../utilities/Button_Comp";
import Flex_Box from "../../../utilities/Flex_Box";
import { Alert, View } from "react-native";
import Form_Item from "../../../utilities/Form_Item";
import { useSelector } from "react-redux";

const Got_Deal = ({
  modalVisible,
  setModalVisible,
  selected_shop_id,
  attended,
}) => {
  const { dark_grey, backgroundColor, light_grey } = light_theme;
  const { token } = useSelector((state) => state?.authReducer);

  const [code, setcode] = useState("");
  return (
    <Modal_Comp
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      label="Got Deal"
    >
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
      >
        <Form_Item
          input_style={{
            borderWidth: 2,
            borderColor: dark_grey,
            height: 50,
          }}
          // keyboardType={"numeric"}
          value={code}
          onchange={(e) => {
            setcode(e);
          }}
          placeholder={"Enter Code Here:"}
        />
        <Flex_Box
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 15,
          }}
        >
          <Button_Comp
            label={"Got Deal"}
            btn_style={{
              paddingVertical: 10,
              borderRadius: 8,
              width: "48%",
            }}
            onClick={() => {
              if (code) {
                attended(selected_shop_id, true, code);
                Alert.alert("Got deal set successfull!");
              } else {
                Alert.alert("Enter the code first!");
              }
              setModalVisible(false);
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
              setModalVisible(false);
            }}
          />
        </Flex_Box>
      </View>
    </Modal_Comp>
  );
};

export default Got_Deal;
