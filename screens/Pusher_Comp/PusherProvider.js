import React, { createContext, useContext, useEffect, useState } from 'react';
import {Pusher} from '@pusher/pusher-websocket-react-native';

// Create a context for Pusher
const PusherContext = createContext(null);

export const PusherProvider = ({ children }) => {
  const [pusher, setPusher] = useState(null);
  const [channels, setChannels] = useState({});

  useEffect(() => {
    // Initialize Pusher
    const pusherInstance = Pusher.getInstance();

    // Set up Pusher with your credentials
    pusherInstance.init({
      apiKey: '3a6e8a2b4fa47e629a65',
      cluster: 'ap4',
      encrypted: true,
    });

    pusherInstance.connect();

    setPusher(pusherInstance);

    // Clean up the connection when the component unmounts
    return () => {
      pusherInstance.disconnect();
    };
  }, []);

  const subscribeToChannel = (channelName) => {
    if (channels[channelName]) {
      return channels[channelName];
    }
    const channel = pusher.subscribe(channelName);
    setChannels((prevChannels) => ({ ...prevChannels, [channelName]: channel }));
    return channel;
  };

  const unsubscribeFromChannel = (channelName) => {
    if (channels[channelName]) {
      pusher.unsubscribe(channelName);
      setChannels((prevChannels) => {
        const updatedChannels = { ...prevChannels };
        delete updatedChannels[channelName];
        return updatedChannels;
      });
    }
  };

  return (
    <PusherContext.Provider value={{ subscribeToChannel, unsubscribeFromChannel }}>
      {children}
    </PusherContext.Provider>
  );
};

// Custom hook to use the Pusher context
export const usePusher = () => {
  return useContext(PusherContext);
};
