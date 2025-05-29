import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
// import SideRoutes from './Sidebar/SideRoutes';
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Auth/Login";
import Intro_Screens from "./Intro_Screens";
import County_Picker from "./County_Picker";
// import Pre_Login from "./Pre_Login";
import { get_item, set_item } from "../utilities/local_storage";
import Signup from "./Auth/SignUp";
// import Driver_Sidebar from './Sidebar/Driver_Sidebar';
// import Driver_SideRoutes from './Sidebar/Driver_SideRoutes';
import Complete_Profile from "./Auth/Complete_Profile";
import Flex_Box from "../utilities/Flex_Box";
import { ActivityIndicator, Alert, Text } from "react-native";
import Forgot_pass from "./Auth/Forgot_pass";
import Request_sent from "./Auth/Request_sent";
import Verify_code from "./Auth/Verify_code";
import Private_Routes from "./Sidebar/Private_Routes";
import { addEventListener } from "@react-native-community/netinfo";
import Alert_comp from "../utilities/Alert_comp";
import { theme_color } from "../utilities/colors";
// import { PusherProvider } from "./Pusher_Comp/PusherProvider";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { set_network_action } from "../redux_prog/actions/base_action";
import { navigationRef } from '../src/services/navigationService';

const Navigation_Comp = () => {
  const is_authenticated = useSelector(
    (state) => state?.authReducer?.is_authenticated
  );
  const {intro_completed,network_on} = useSelector(
    (state) => state?.baseReducer
  );
  const dispatch = useDispatch();
  const is_loading = useSelector((state) => state?.baseReducer?.is_loading);
  // const user_data = useSelector(state => state?.authReducer?.user_data);
  const login_type = useSelector((state) => state?.authReducer?.login_type);
  const Stack = createStackNavigator();
  const [count, setCount] = React.useState(0);
  // const [network_on, setnetwork_on] = React.useState(true);

  const checkLocationPermission = async () => {
    try {
      const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert("Location is not available on this device.");
          break;
        case RESULTS.DENIED:
          Alert.alert(
            "Location permission is denied. Please enable it from settings."
          );
          break;
        case RESULTS.GRANTED:
          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            "Location permission is blocked. Please enable it from settings."
          );
          break;
      }
    } catch (error) {
      console.error("Error checking location permission: ", error);
    }
  };

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

  const layout = React.useMemo(() => {
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
        {!network_on && !is_authenticated &&
          Alert.alert(
            `You appear to be offline. Updated details won't be available`
          )}
      </NavigationContainer>
    );
  }, [
    is_authenticated,
    intro_completed,
    get_item,
    set_item,
    login_type,
    is_loading,
    network_on,
  ]);

  React.useEffect(() => {
    checkLocationPermission();
  }, [])
  

  return layout;
};

export default Navigation_Comp;
