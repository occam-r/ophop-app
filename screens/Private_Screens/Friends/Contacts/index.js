import { View, Text } from "react-native";
import React, { useState } from "react";
import ContactList from "./ContactList";
import SendMessageModal from "./SendMessageModal";

const Contacts = ({ navigation }) => {
  const [modalVisible, setmodalVisible] = useState(false);
  return (
    <>
      <ContactList
        modalVisible={modalVisible}
        setmodalVisible={setmodalVisible}
        navigation={navigation}
      />
      <SendMessageModal
        modalVisible={modalVisible}
        setmodalVisible={setmodalVisible}
        navigation={navigation}
      />
    </>
  );
};

export default Contacts;
