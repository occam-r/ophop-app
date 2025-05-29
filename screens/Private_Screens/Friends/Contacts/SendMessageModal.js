import { View, Text } from "react-native";
import React from "react";
import Modal_Comp from "../../../../utilities/Modal_Comp";
import Form_Item from "../../../../utilities/Form_Item";
import Flex_Box from "../../../../utilities/Flex_Box";
import Button_Comp from "../../../../utilities/Button_Comp";
import { light_theme, theme_color } from "../../../../utilities/colors";

const SendMessageModal = ({ modalVisible, setmodalVisible, navigation }) => {
  const { backgroundColor } = light_theme;
  return (
    <Modal_Comp
      modalVisible={modalVisible}
      setModalVisible={setmodalVisible}
      label={"Send Message"}
    >
      <View
        style={{
          //   paddingVertical: 10,
          paddingHorizontal: 15,
          width: "100%",
        }}
      >
        <Form_Item
          label={"Enter Data"}
          style={{
            paddingVertical: 5,
          }}
        />
        <Flex_Box
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Button_Comp
            label={"Send"}
            onClick={() => {
              navigation?.navigate("ChatScreen");
            }}
            btn_style={{
              width: "45%",
              paddingVertical: 10,
              borderWidth: 2,
              borderColor: theme_color,
            }}
          />
          <Button_Comp
            label={"Cancel"}
            onClick={() => {
              setmodalVisible(false);
            }}
            btn_style={{
              width: "45%",
              paddingVertical: 10,
              backgroundColor,
              borderWidth: 2,
              borderColor: theme_color,
            }}
            text_style={{
              color: theme_color,
            }}
          />
        </Flex_Box>
      </View>
    </Modal_Comp>
  );
};

export default SendMessageModal;
