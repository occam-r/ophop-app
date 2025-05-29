import { Text,TouchableOpacity,Dimensions, Platform, Image,View, Modal, FlatList,} from "react-native";
import React, { useEffect, useState } from "react";
import { dark_theme, light_theme, theme_color } from "../../utilities/colors";
import { useDispatch, useSelector } from "react-redux";
import Scroll_Comp from "../../utilities/Scroll_Comp";
import Form_Item from "../../utilities/Form_Item";
import Icon from "react-native-vector-icons/FontAwesome";
import Button_Comp from "../../utilities/Button_Comp";
import {login_action,set_auth_location_action, set_token_action,set_user_action,} from "../../redux_prog/actions/auth_action";
import Alert_comp from "../../utilities/Alert_comp";
import { login_api } from "../../apis";
import {
  set_loading_action,
  set_location_action,
  set_selected_country_action,
} from "../../redux_prog/actions/base_action";
import get_error_msg from '../../utilities/utilities';
import return_error from "../../utilities/Return_Error";
import GetLocation from "react-native-get-location";
import { auth } from "../../apis/firebase_config";
import OPSVG from "../../images/ophoplogo.svg";
import messaging from "@react-native-firebase/messaging";
import { onFacebookButtonPress } from '../../src/services/facebookAuth'; // ✅ correct path
import { onGoogleButtonPress } from '../../src/services/googleAuth';
import { ensureNotificationPermission } from '../../src/services/notificationHandler';

// Country data
const countries = [
  { name: 'United States', dial_code: '+1', flag: '🇺🇸', code: 'US' },
  { name: 'United Kingdom', dial_code: '+44', flag: '🇬🇧', code: 'GB' },
  { name: 'Canada', dial_code: '+1', flag: '🇨🇦', code: 'CA' },
  { name: 'Australia', dial_code: '+61', flag: '🇦🇺', code: 'AU' },
  { name: 'India', dial_code: '+91', flag: '🇮🇳', code: 'IN' },
  { name: 'China', dial_code: '+86', flag: '🇨🇳', code: 'CN' },
  { name: 'Japan', dial_code: '+81', flag: '🇯🇵', code: 'JP' },
  { name: 'Germany', dial_code: '+49', flag: '🇩🇪', code: 'DE' },
  { name: 'France', dial_code: '+33', flag: '🇫🇷', code: 'FR' },
  { name: 'Brazil', dial_code: '+55', flag: '🇧🇷', code: 'BR' },
  { name: 'Bangladesh', dial_code: '+88', flag: '🇧🇷', code: 'BR' },
  // Add more countries as needed
];

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const selected_country = useSelector(
    (state) => state?.baseReducer?.selected_country
  );
  const [country_selected, set_country_selected] = useState(selected_country);
  const { name, dial_code, flag, code } = country_selected;

  const theme = useSelector((state) => state?.themeReducer?.theme);
  const theme_config = theme == "light" ? light_theme : dark_theme;
  const { text_color, backgroundColor, shadowColor, grey } = theme_config;
  const [is_password, setis_password] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [login_data, setlogin_data] = useState({
    phone: null,
    password: "",
  });

  const [loading, setloading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const { phone, password } = login_data;

  const validatePhoneNumber = (number) => {
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');
    // Check if number is valid length (10 digits)
    if (cleaned.length == selected_country ) {
      setPhoneError('Phone number must be valid digits');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const formatPhoneNumberDisplay = (number) => {
    if (!number) return '';
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return cleaned;
  };

  const upd_login_data = (key, val) => {
    if (key === 'phone') {
      // Remove formatting for validation
      const cleanedNumber = val.replace(/\D/g, '');
      validatePhoneNumber(cleanedNumber);
      // Update with formatted display
      setlogin_data({
        ...login_data,
        [key]: cleanedNumber,
      });
    } else {
      setlogin_data({
        ...login_data,
        [key]: val,
      });
    }
  };

  const handleCountrySelect = (country) => {
    // dispatch(set_country_selected(country));
    set_country_selected(country);
    setShowCountryPicker(false);
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCountrySelect(item)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      }}
    >
      <Text style={{ fontSize: 20, marginRight: 10 }}>{item.flag}</Text>
      <Text style={{ fontSize: 16, color: text_color }}>{item.name}</Text>
      <Text style={{ fontSize: 16, color: grey, marginLeft: 'auto' }}>{item.dial_code}</Text>
    </TouchableOpacity>
  );

  const pass_suffix = is_password ? (
    <TouchableOpacity
      onPress={() => {
        setis_password(false);
      }}
    >
      <Icon name="eye-slash" size={20} color="#000" />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={() => {
        setis_password(true);
      }}
    >
      <Icon name="eye" size={20} color="#000" />
    </TouchableOpacity>
  );

  const checkToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      console.warn(fcmToken);
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const handleFacebookLogin = async () => {
    try {
      setloading(true);
      const result = await onFacebookButtonPress();
      const { user } = result;
      
      // Get user's current location
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });
      
      dispatch(set_location_action({
        latitude: location.latitude,
        longitude: location.longitude,
      }));
      
      dispatch(set_auth_location_action({
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      // Set user data in Redux
      dispatch(set_user_action({
        userid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }));
      
      dispatch(login_action());
    } catch (error) {
      console.log('Caught error:', error);
      Alert_comp({
        msg: get_error_msg ? get_error_msg(error) : (error?.message || 'Unknown error'),
        type: "error",
      });
    }
    
  };

  const handleGoogleLogin = async () => {
    try {
      setloading(true);
      const result = await onGoogleButtonPress();
      const { user } = result;
      
      // Get user's current location
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });
      
      dispatch(set_location_action({
        latitude: location.latitude,
        longitude: location.longitude,
      }));
      
      dispatch(set_auth_location_action({
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      // Set user data in Redux
      dispatch(set_user_action({
        userid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }));
      
      dispatch(login_action());
    } catch (error) {
      console.log('Google Sign-In Error:', error);
      Alert_comp({
        msg: get_error_msg ? get_error_msg(error) : (error?.message || 'Unknown error'),
        type: "error",
      });
    } finally {
      setloading(false);
    }
  };

  const handleLogin = async (loginData) => {
    try {
      setloading(true);
      const res = await login_api({
        password: loginData.password,
        phone: loginData.phone
      }, dial_code);

      // Get user's current location
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });

      dispatch(set_location_action({
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      dispatch(set_auth_location_action({
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      dispatch(set_token_action("Bearer " + res.data.data.token?.split("|")[1]));
      dispatch(set_user_action({
        userid: res.data.data.userId,
      }));

      // Request notification permission after successful login
      await ensureNotificationPermission();

      dispatch(login_action());
    } catch (err) {
      console.log("Login error:", err);
      Alert_comp("Invalid Credentials", "Please enter correct credentials!");
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <Scroll_Comp
        view_style={
          Platform.OS == "ios"
            ? {
                backgroundColor,
              }
            : {
                flex: 1,
                backgroundColor,
              }
        }
        scroll_container_style={{
          marginTop: 5,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            marginTop: 50,
          }}
        >
          <OPSVG />
        </View>
        <Text
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: "#000",
            marginTop: 25,
          }}
        >
          Welcome Back
        </Text>
        <Text style={{ fontSize: 18, color: "#000" }}>
          Please log in to your account
        </Text>
        <Form_Item
          style={{
            marginTop: 30,
            width: "100%",
          }}
          input_style={{
            paddingLeft: 10,
            height: 60,
            fontSize: 16,
          }}
          keyboardType={"phone-pad"}
          placeholder={""}
          value={formatPhoneNumberDisplay(phone)}
          onchange={(e) => {
            upd_login_data("phone", e);
          }}
          prefix={
            <TouchableOpacity
              onPress={() => setShowCountryPicker(true)}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                paddingLeft: 10,
                minWidth: 80,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: text_color,
                  marginTop: -4,
                  fontWeight: '500',
                }}
              >
                {flag + " " + dial_code}
              </Text>
              <Icon name="chevron-down" size={12} color={text_color} style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          }
        />
        {phoneError ? (
          <Text style={{ color: 'red', marginTop: 5, fontSize: 14 }}>{phoneError}</Text>
        ) : null}

        {/* Country Picker Modal */}
        <Modal
          visible={showCountryPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCountryPicker(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ 
              backgroundColor: backgroundColor,
              marginTop: 100,
              marginHorizontal: 20,
              borderRadius: 10,
              maxHeight: '70%',
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: text_color }}>Select Country</Text>
                <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                  <Icon name="times" size={20} color={text_color} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={countries}
                renderItem={renderCountryItem}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
        </Modal>

        <Form_Item
          style={{
            marginTop: 30,
            width: "100%",
          }}
          input_style={{
            paddingLeft: 10,
            height: 60,
          }}
          placeholder={"Enter your password"}
          suffix={pass_suffix}
          is_password={is_password}
          value={password}
          onchange={(e) => {
            upd_login_data("password", e);
          }}
        />
        <Button_Comp
          btn_style={{
            backgroundColor: "#fff",
            justifyContent: "flex-end",
            paddingRight: 10,
            paddingTop: 0,
            marginTop: 20,
          }}
          text_style={{
            color: theme_color,
            fontWeight: 500,
            fontSize: 15,
            textAlign: "right",
          }}
          onClick={() => {
            navigation.navigate("forgot_pass");
          }}
          label={"Forgot Password ?"}
        />
        <Button_Comp
          btn_style={{
            marginTop: 25,
          }}
          label={"Login"}
          loading={loading}
          onClick={() => {
            if (password && phone) {
              if (!validatePhoneNumber(phone)) {
                return;
              }
              handleLogin({ password, phone });
            } else {
              Alert_comp("Please enter both fields!");
            }
          }}
        />
        <Button_Comp
          btn_style={{
            backgroundColor,
          }}
          text_style={{
            color: theme_color,
          }}
          onClick={() => {
            navigation.navigate("Signup");
          }}
          label={"Create Account"}
        />
        {/* Social Login Modern Icons */}
        <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 30 }}>
          <View style={{ flexDirection: 'row', gap: 24 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#4267B2',
                borderRadius: 50,
                width: 54,
                height: 54,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 3,
              }}
              onPress={handleFacebookLogin}
              activeOpacity={0.8}
            >
              <Icon name="facebook" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#DB4437',
                borderRadius: 50,
                width: 54,
                height: 54,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 3,
              }}
              onPress={handleGoogleLogin}
              activeOpacity={0.8}
            >
              <Icon name="google" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={{ color: grey, fontSize: 14, marginTop: 10, fontWeight: '500' }}>Continue with social account</Text>
        </View>
      </Scroll_Comp>
    </>
  );
};

export default Login;
