import {
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  View,
  Modal,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { dark_theme, light_theme, theme_color } from "../../utilities/colors";
import { useDispatch, useSelector } from "react-redux";
import Scroll_Comp from "../../utilities/Scroll_Comp";
import Form_Item from "../../utilities/Form_Item";
import Icon from "react-native-vector-icons/FontAwesome";
import Button_Comp from "../../utilities/Button_Comp";
import {
  login_action,
  set_auth_location_action,
  set_token_action,
  set_user_action,
} from "../../redux_prog/actions/auth_action";
import { checkCredentials_api, signup_api } from "../../apis";
import Alert_comp from "../../utilities/Alert_comp";
import return_error from "../../utilities/Return_Error";
import CheckBox from "react-native-check-box";
import Flex_Box from "../../utilities/Flex_Box";
import GetLocation from "react-native-get-location";
import { set_location_action, set_selected_country_action } from "../../redux_prog/actions/base_action";
import { auth } from "../../apis/firebase_config";
import OPSVG from "../../images/ophoplogo.svg";
import { getFCMToken } from "../../utilities/FCMToken";
import dayjs from "dayjs";
import "dayjs/plugin/timezone";
import "dayjs/plugin/utc";

// Configure timezone plugin
dayjs.extend(require('dayjs/plugin/timezone'));
dayjs.extend(require('dayjs/plugin/utc'));

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
];

const Signup = ({ navigation }) => {
  const dispatch = useDispatch();
  const { text_color, backgroundColor, shadowColor, grey, dark_grey } = light_theme;
  const [is_password, setis_password] = useState(false);
  const [email_sent, setemail_sent] = useState(false);
  const [loading, setloading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  

  const [user_data, setuser_data] = useState({});

  const {
    username,
    phone,
    email,
    code,
    password,
    c_password,
    agreedWithTerms,
  } = user_data;

  const upd_user_data = (key, val) => {
    console.log("key>>>>>>>>>>>>>>>>", key, val);
    setuser_data({
      ...user_data,
      [key]: val,
    });
  };

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

  const selected_country = useSelector(
    (state) => state?.baseReducer?.selected_country
  );
  // const { name, dial_code, flag } = selected_country;
  const [country_selected, set_country_selected] = useState(selected_country);

  const { name, dial_code, flag } = country_selected;

  const handleCountrySelect = (country) => {
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

  const checkcredentials = () => {
    setloading(true);
    // Format phone number with country code
    const formattedPhone = dial_code.replace("+", "") + phone;
    
    checkCredentials_api({
      email,
      phoneNumber: formattedPhone,
      country_code: dial_code,
    })
      .then((res) => {
        console.warn("Verification response:", res.data);
        setloading(false);
        if (res.data.data.emailIsAvailable) {
          Alert_comp("Email already taken");
        } else if (res.data.data.phoneIsAvailable) {
          Alert_comp("Phone number already taken");
        } else {
          console.log("Verification code sent successfully");
          setemail_sent(true);
          Alert_comp("Success", "Verification code has been sent to your email and phone number.");
        }
      })
      .catch((err) => {
        setloading(false);
        console.error("Verification error:", err);
        Alert_comp("Error", return_error(err));
      });
  };

  const signup = async () => {
    setloading(true);
    try {
      const fcmToken = await getFCMToken();
      // Format phone number with country code
      const formattedPhone = dial_code.replace("+", "") + phone;
    
      const res = await signup_api({
        phone: formattedPhone,
        password,
        email,
        username,
        verificationCode: code,
        role: "user",
        device_name: "mobile",
        fcm_token: fcmToken || "",
        last_name: "",
        timezone: dayjs.tz.guess(),
      });

      setloading(false);
      
      const userData = res?.data?.data;
      console.warn("Signup response:", userData);
    
      if (!userData || !userData.token || !userData.userId) {
        console.error("Invalid response structure:", res);
        Alert_comp("Error", "Signup failed. Please try again later.");
        return;
      }
    
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      })
        .then(async (location) => {
          try {
            dispatch(set_location_action({
              latitude: location.latitude,
              longitude: location.longitude,
            }));
            dispatch(set_auth_location_action({
              latitude: location.latitude,
              longitude: location.longitude,
            }));
          } catch (error) {
            console.error(error);
          }
        })
        .catch((error) => {
          const { code, message } = error;
          console.warn(code, message);
        });
    
      dispatch(set_token_action(
        "Bearer " + userData.token.split("|")[1]
      ));
    
      dispatch(set_user_action({
        userid: userData.userId,
        ...userData.user
      }));
    
      dispatch(login_action());
    } catch (error) {
      setloading(false);
      console.error("Signup error:", error);
      Alert_comp("Error", "Signup failed. Please try again later.");
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
        {/* <Text
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: theme_color,
            marginTop: 50,
          }}
        >
          OpHop.
        </Text> */}
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
          Register New Account
        </Text>
        <Text style={{ fontSize: 18, color: "#000" }}>
          G'day there! Sign up below to get hopping.
        </Text>
        {!email_sent && (
          <>
            <Form_Item
              style={{
                marginTop: 30,
                width: "100%",
              }}
              input_style={{
                paddingLeft: 10,
                height: 60,
              }}
              placeholder={"User Name"}
              value={username}
              onchange={(e) => {
                upd_user_data("username", e);
              }}
            />
            <Form_Item
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
                    minWidth: 100,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: text_color,
                      marginTop: -4,
                    }}
                  >
                    {flag + " " + dial_code}
                  </Text>
                  <Icon name="chevron-down" size={12} color={text_color} style={{ marginLeft: 5 }} />
                </TouchableOpacity>
              }
              style={{
                marginTop: 30,
                width: "100%",
              }}
              input_style={{
                paddingLeft: 10,
                height: 60,
              }}
              placeholder={"Phone Number"}
              value={phone}
              onchange={(e) => {
                upd_user_data("phone", e);
              }}
            />
            <Form_Item
              style={{
                marginTop: 30,
                width: "100%",
              }}
              input_style={{
                paddingLeft: 10,
                height: 60,
              }}
              placeholder={"Email Address"}
              value={email}
              onchange={(e) => {
                upd_user_data("email", e);
              }}
            />
          </>
        )}
        {email_sent && (
          <>
            <Form_Item
              style={{
                marginTop: 30,
                width: "100%",
              }}
              input_style={{
                paddingLeft: 10,
                height: 60,
              }}
              placeholder={"Email code for SMS"}
              value={code}
              onchange={(e) => {
                upd_user_data("code", e);
              }}
            />
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
              is_password={is_password}
              suffix={pass_suffix}
              value={password}
              onchange={(e) => {
                upd_user_data("password", e);
              }}
            />
            <Form_Item
              style={{
                marginTop: 30,
                width: "100%",
              }}
              input_style={{
                paddingLeft: 10,
                height: 60,
              }}
              placeholder={"Repeat your password"}
              value={c_password}
              onchange={(e) => {
                upd_user_data("c_password", e);
              }}
            />
          </>
        )}
        {email_sent && (
          <Flex_Box
            style={{
              justifyContent: "start",
              flexDirection: "row",
              alignItems: "",
              gap: 5,
              paddingRight: 10,
              marginTop: 20,
            }}
          >
            <CheckBox
              style={{
                marginLeft: -2,
              }}
              onClick={() => {
                upd_user_data(
                  "agreedWithTerms",
                  agreedWithTerms ? false : true
                );
              }}
              isChecked={agreedWithTerms}
              checkedCheckBoxColor={theme_color}
            />
            <Text
              style={{
                color: dark_grey,
              }}
            >
              By creating a new account, you agree to our Terms of Services &
              Privacy Policy
            </Text>
          </Flex_Box>
        )}

        <Button_Comp
          btn_style={{
            marginTop: 25,
            backgroundColor:
              !email_sent && username && phone && email
                ? theme_color
                : email_sent && code && password && c_password == password
                ? theme_color
                : "#c9c9c9",
          }}
          text_style={{
            color:
              !email_sent && username && phone && email
                ? "#fff"
                : email_sent && code && password && c_password == password
                ? "#fff"
                : "#000",
          }}
          onClick={() => {
            if (email_sent) {
              if (code && password && c_password == password) {
                if (agreedWithTerms) {
                  signup();
                } else {
                  Alert_comp("You have to agree with our terms to continue!");
                }
              } else {
                Alert_comp("Plaese enter all fields");
              }
            } else {
              setemail_sent(true);
              if (email && phone && username) {
                checkcredentials();
              } else {
                Alert_comp("Plaese enter all fields");
              }
            }
          }}
          label={email_sent ? "Sign Up" : "Next"}
          loading={loading}
        />
      </Scroll_Comp>
      <Modal
        visible={showCountryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: backgroundColor,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '80%',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '500',
                color: text_color,
              }}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Icon name="times" size={20} color={text_color} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={countries}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Signup;
