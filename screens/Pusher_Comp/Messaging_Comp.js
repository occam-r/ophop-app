import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
// import { Pusher } from "@pusher/pusher-websocket-react-native";
import { BASE_URL } from "../../apis/config";
import { useSelector } from "react-redux";

const MsgScreen = ({ room_id }) => {
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState(""); // New state for receiving messages
  // const pusher = Pusher.getInstance();
  const token = useSelector((state) => state?.authReducer?.token);

  useEffect(() => {
    // const initializePusher = async () => {
    //   await pusher.init({
    //     apiKey: "3a6e8a2b4fa47e629a65", // Replace with your Pusher App Key
    //     cluster: "ap4", // Replace with your Pusher Cluster
    //     authEndpoint: `${BASE_URL}/broadcasting/auth`,
    //     auth: { headers: { Authorization: `Bearer ${token}` } },
    //   });
    //   await pusher.connect();

    //   // Subscribe to a private channel
    //   const channel = await pusher.subscribe({
    //     channelName: room_id,
    //   });

    //   // Listen for messages sent by the driver
    //   channel.bind(
    //     `private-chat-${room_id}.App\\Events\\NewChatMessage`,
    //     (event) => {
    //       setReceivedMessage(event.data.message);
    //     }
    //   );
    // };

    // initializePusher();

    // return () => {
    //   pusher.unsubscribe({ channelName: room_id });
    //   pusher.disconnect();
    // };
  }, []);

  // Function to send message to driver
  const sendMessage = async () => {
    // console.warn('ok');
    // pusher.trigger(room_id, `private-chat-${room_id}.App\\Events\\NewChatMessage`, {
    //   message: message
    // });
    setMessage("");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Customer App - Send Message to Driver</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginVertical: 10,
        }}
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send Message" onPress={sendMessage} />

      {/* Display received message */}
      {receivedMessage ? (
        <Text>Driver: {receivedMessage}</Text>
      ) : (
        <Text>No messages from the driver</Text>
      )}
    </View>
  );
};

export default MsgScreen;
