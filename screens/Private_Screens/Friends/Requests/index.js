import { View, Text } from "react-native";
import React from "react";
import RequestList from "./RequestList";

const Requests = ({ navigation }) => {
  return <RequestList navigation={navigation} />;
};

export default Requests;
