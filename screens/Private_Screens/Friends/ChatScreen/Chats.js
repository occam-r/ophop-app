import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import database, {
  getDatabase,
  ref,
  push,
  set,
  onValue,
} from "@react-native-firebase/database";
import { useSelector } from "react-redux";

const Chats = ({ navigation }) => {

  
  const [message, setmessage] = useState("Hello");
  const [messages, setmessages] = useState([]);

  const { user_data } = useSelector((state) => state?.authReducer);

  const send_message = () => {
    // try {
    //   const db = getDatabase();
    //   const postListRef = ref(db, "messages");
    //   const newPostRef = push(postListRef);
    //   set(newPostRef, {
    //     msg: message,
    //   });
    // } catch (error) {
    //   console.error(error);
    // }
  };

  useEffect(() => {
    // const messagesListener = database()
    //   .ref("messages")
    //   .orderByChild("createdAt")
    //   .on("value", (snapshot) => {
    //     const data = snapshot.val() || {};
    //     const Messages = Object.keys(data)
    //       .map((key) => ({
    //         _id: key,
    //         ...data[key],
    //       }))
    //       .reverse(); // reverse to show latest messages first
    //     setmessages(Messages);
    //   });

    // return () => database().ref("messages").off("value", messagesListener);
  }, []);

  return (
    <View>
      <TouchableOpacity
        onPress={send_message}
        style={{
          borderColor: "#000",
        }}
      >
        <Text
          style={{
            color: "#000",
          }}
        >
          Send
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Chats;
