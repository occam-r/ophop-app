import React, { useEffect, useState } from "react";
import Modal_Comp from "../utilities/Modal_Comp";
import Button_Comp from "../utilities/Button_Comp";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Flex_Box from "../utilities/Flex_Box";
import { Text, View } from "react-native";
import Form_Item from "../utilities/Form_Item";
import { light_theme, theme_color } from "../utilities/colors";

const Fav_Modal = ({ additional_shop_data, toggle_fav, style }) => {
  const [reasonOfAdding, setreasonOfAdding] = useState("");
  const [modalvisible, setmodalvisible] = useState(false);
  const { dark_grey, backgroundColor, light_grey } = light_theme;
  const style_obj = style || {};

  useEffect(() => {
    setreasonOfAdding("");
  }, [modalvisible]);

  return (
    <>
      <Button_Comp
        btn_style={{
          backgroundColor: additional_shop_data?.isFavorite
            ? "pink"
            : light_grey,
          justifyContent: "start",
          paddingVertical: 1,
          height: 40,
          borderRadius: 10,
          marginTop: 10,
          width: "48%",
          ...style_obj,
        }}
        onClick={() => {
          if (additional_shop_data?.isFavorite) {
            toggle_fav(additional_shop_data?.id, {
              reasonOfAdding: reasonOfAdding || "",
              isFavorite: false,
            });
          } else {
            toggle_fav(additional_shop_data?.id, {
              reasonOfAdding: reasonOfAdding || "",
              isFavorite: true,
            });
          }
        }}
        element={
          <Flex_Box
            style={{
              gap: 10,
              flexDirection: "row",
            }}
          >
            <FontAwesome6
              name="heart"
              size={20}
              color={additional_shop_data?.isFavorite ? "#fff" : dark_grey}
            />
            <Text
              style={{
                fontWeight: 500,
                color: additional_shop_data?.isFavorite ? "#fff" : dark_grey,
              }}
            >
              {additional_shop_data?.isFavorite ? "Remove" : "Add to fav"}
            </Text>
          </Flex_Box>
        }
      />
      <Modal_Comp
        modalVisible={modalvisible}
        setModalVisible={setmodalvisible}
        label={"What do you love about this store?"}
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
              height: 80,
            }}
            value={reasonOfAdding}
            onchange={(e) => {
              setreasonOfAdding(e);
            }}
            placeholder={"What I Love: Reason for favourite"}
          />
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <Button_Comp
              label={"Add to fav"}
              btn_style={{
                paddingVertical: 10,
                borderRadius: 8,
                width: "48%",
              }}
              onClick={() => {
                toggle_fav(additional_shop_data?.id, {
                  reasonOfAdding: reasonOfAdding || "",
                  isFavorite: additional_shop_data?.isFavorite ? false : true,
                });
                setmodalvisible(false);
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
                setmodalvisible(false);
              }}
            />
          </Flex_Box>
        </View>
      </Modal_Comp>
    </>
  );
};

export default Fav_Modal;
