import React, { useEffect, useState } from "react";
import Button_Comp from "../Button_Comp";
import Icon from "react-native-vector-icons/FontAwesome";
import Flex_Box from "../Flex_Box";
import { Text } from "react-native";
import Select_Modal from "../Select_Box";
import { countries } from "../countries";
import { useSelector } from "react-redux";
import { light_theme } from "../colors";

const SearchBar_Comp = ({ label, navigation, select_style, tag, tagName }) => {
  const [modalVisible, setmodalVisible] = useState(tag ? true : false);

  useEffect(() => {
    if (tag) {
      setmodalVisible(true);
    }
  }, [tag, tagName]);

  const select_style_obj = select_style || {};
  const { light_grey } = light_theme;

  const { tags } = useSelector((state) => state?.baseReducer);

  const tag_options = tags?.map((el) => {
    return {
      label: el?.tagName,
      value: el?.id,
    };
  });

  return (
    <>
      <Select_Modal
        element={
          <Button_Comp
            btn_style={{
              backgroundColor: light_grey,
              justifyContent: "start",
              paddingVertical: 10,
              paddingLeft: 40,
              marginVertical: 20,
              ...select_style_obj,
            }}
            text_style={{
              color: "grey",
            }}
            label={"Name, Suburb, Goods & Org"}
            prefix={<Icon name="search" size={20} color="grey" />}
            onClick={() => {
              setmodalVisible(true);
            }}
          />
        }
        modalVisible={modalVisible}
        setModalVisible={setmodalVisible}
        options={tag_options || []}
        onChange={(e) => {
          navigation?.navigate("Hop", {
            tag: e?.value,
          });
        }}
        navigation={navigation}
        hop_search={true}
        tag={tag}
        tagName={tagName}
      />
      {/* // countries.map((el) => {
          // return {
          //   label: el.name,
          //   value: el.name,
          // }; */}
    </>
  );
};

export default SearchBar_Comp;
