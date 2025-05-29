import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Flex_Box from "../../../utilities/Flex_Box";
import { screen_height, screen_width } from "../../../utilities/utilities";
import Form_Item from "../../../utilities/Form_Item";

const Nav_Filter = ({ setopen_search,open_search,setsearch_text,search_text }) => {
  return (
    <>
    <TouchableOpacity
      onPress={() => {
        setopen_search(true);
      }}
    >
      <FontAwesome name="search" size={20} color="#fff" />
    </TouchableOpacity>
    {open_search && (
      <Flex_Box
        style={{
          position: "absolute",
          zIndex: 2001,
          right: -20,
          top: -18,
          height: screen_height - 745,
          width: screen_width,
          paddingHorizontal: 5,
        }}
      >
        <Form_Item
          value={search_text}
          onchange={(e) => {
            setsearch_text(e);
          }}
          placeholder={"Enter text here.."}
          suffix={
            <Flex_Box
              style={{
                width: 30,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setopen_search(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#000",
                  }}
                >
                  &times;
                </Text>
              </TouchableOpacity>
            </Flex_Box>
          }
        />
      </Flex_Box>
    )}
  </>
  );
};

export default Nav_Filter;
