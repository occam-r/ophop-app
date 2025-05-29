import { View, Text, Alert } from "react-native";
import React from "react";

export const confirm_Alert = (title, message, onSuccess) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: onSuccess,
      },
    ],
    { cancelable: false }
  );
};

const Alert_comp = (title, msg) => {
  Alert.alert(
    title,
    msg
    //   [
    //     {
    //       text: 'Cancel',
    //       onPress: () => Alert.alert('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //   ]
  );
};

export default Alert_comp;
