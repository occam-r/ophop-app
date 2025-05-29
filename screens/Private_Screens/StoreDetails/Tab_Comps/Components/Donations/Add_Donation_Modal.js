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
// import BluetoothScanner from "../../Available_Devices";
import { light_theme } from "../../../../../../utilities/colors";

const Add_Donation_Modal = ({
  modalVisible,
  setModalVisible,
  label,
  children,
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
            </View>
            {children}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Add_Donation_Modal;
