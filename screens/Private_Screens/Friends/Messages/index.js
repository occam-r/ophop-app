import { View, Text } from "react-native";
import React from "react";
import MessageList from "./MessageList";

const Messages = ({ navigation }) => {
  return <MessageList navigation={navigation} />;
};

export default Messages;
