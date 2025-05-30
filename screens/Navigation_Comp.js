import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import "react-native-gesture-handler";
// import SideRoutes from './Sidebar/SideRoutes';
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Auth/Login";
import County_Picker from "./County_Picker";
// import Pre_Login from "./Pre_Login";
import Signup from "./Auth/SignUp";
// import Driver_Sidebar from './Sidebar/Driver_Sidebar';
// import Driver_SideRoutes from './Sidebar/Driver_SideRoutes';
import { addEventListener } from "@react-native-community/netinfo";
import { ActivityIndicator, Alert } from "react-native";
import { theme_color } from "../utilities/colors";
import Flex_Box from "../utilities/Flex_Box";
import Complete_Profile from "./Auth/Complete_Profile";
import Forgot_pass from "./Auth/Forgot_pass";
import Request_sent from "./Auth/Request_sent";
import Verify_code from "./Auth/Verify_code";
import Private_Routes from "./Sidebar/Private_Routes";
// import { PusherProvider } from "./Pusher_Comp/PusherProvider";
import { set_network_action } from "../redux_prog/actions/base_action";
import { navigationRef } from '../src/services/navigationService';

const Navigation_Comp = () => {
  const is_authenticated = useSelector(
    (state) => state?.authReducer?.is_authenticated
  );
  const { intro_completed, network_on } = useSelector(
    (state) => state?.baseReducer
  );
  const dispatch = useDispatch();
  const is_loading = useSelector((state) => state?.baseReducer?.is_loading);
  // const user_data = useSelector(state => state?.authReducer?.user_data);
  const login_type = useSelector((state) => state?.authReducer?.login_type);
  const Stack = createStackNavigator();
  const [count, setCount] = React.useState(0);
  // const [network_on, setnetwork_on] = React.useState(true);


  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
      addEventListener((state) => {
        dispatch(set_network_action(state.isConnected));
      });
    }, 1000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [count]);

  React.useEffect(() => {
    if (!network_on && !is_authenticated) {
      Alert.alert(
        `You appear to be offline. Updated details won't be available`
      )
    }
  }, [])


  return (
    <NavigationContainer ref={navigationRef}>
      {is_authenticated && <Private_Routes />}
      {!is_authenticated && (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="County Picker"
            component={County_Picker}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="forgot_pass"
            component={Forgot_pass}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="req_sent"
            component={Request_sent}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Complete Profile"
            component={Complete_Profile}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Verify Code"
            component={Verify_code}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
      {is_loading > 0 && (
        <Flex_Box
          style={{
            height: "100%",
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <ActivityIndicator color={theme_color} size={40} />
        </Flex_Box>
      )}
    </NavigationContainer>
  );
};

export default Navigation_Comp;
