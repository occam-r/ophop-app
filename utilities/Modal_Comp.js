import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { light_theme } from "../utilities/colors";
import Flex_Box from "./Flex_Box";

const Modal_Comp = ({
  modalVisible,
  setModalVisible,
  label,
  children,
  non_closable,
  head_element
}) => {
  const theme_config = light_theme;
  const { text_color, backgroundColor, shadowColor, grey } = theme_config;

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    },
    modalView: {
      //   flex: 1,
      width: "100%",
      backgroundColor,
      paddingVertical: 15,
      paddingTop: 20,
      alignItems: "center",
      borderRadius: 10,
      shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      position: "relative",
    },
  });

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {label && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 15,
                }}
              >
                <Text
                  style={{
                    color: text_color,
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </Text>
                <Flex_Box
                  style={{
                    width: "",
                    flexDirection: "row",
                  }}
                >
                  {head_element || null}
                  {!non_closable && (
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 26,
                          fontWeight: 700,
                          color: text_color,
                        }}
                      >
                        &times;
                      </Text>
                    </TouchableOpacity>
                  )}
                </Flex_Box>
              </View>
            )}
            {children}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Modal_Comp;
