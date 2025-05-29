import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
// import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native';

const DriverApp = () => {
  const [receivedMessage, setReceivedMessage] = useState('');
  // const pusher = Pusher.getInstance();

  useEffect(() => {
    // const initializePusher = async () => {
    //   await pusher.init({
    //     apiKey: 'YOUR_PUSHER_KEY',  // Replace with your Pusher App Key
    //     cluster: 'YOUR_PUSHER_CLUSTER',  // Replace with your Pusher Cluster
    //   });
    //   await pusher.connect();

    //   // Subscribe to the same private channel as the Customer
    //   const channel = await pusher.subscribe({
    //     channelName: 'private-driver-channel',
    //   });

    //   // Listen for messages sent by the Customer
    //   channel.bind('client-message', (event) => {
    //     console.log('Driver received:', event.data.message);
    //     setReceivedMessage(event.data.message);
    //   });
    // };

    // initializePusher();

    // return () => {
    //   pusher.unsubscribe({ channelName: 'private-driver-channel' });
    //   pusher.disconnect();
    // };
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Driver App - Received Message</Text>
      <Text>{receivedMessage ? `Message: ${receivedMessage}` : 'No messages yet'}</Text>
    </View>
  );
};


export default DriverApp;