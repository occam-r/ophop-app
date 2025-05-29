import {
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { dark_theme, light_theme, theme_color } from "../../utilities/colors";
import { useDispatch, useSelector } from "react-redux";
import Scroll_Comp from "../../utilities/Scroll_Comp";
import Form_Item from "../../utilities/Form_Item";
import Icon from "react-native-vector-icons/FontAwesome";
import Button_Comp from "../../utilities/Button_Comp";
import Flex_Box from "../../utilities/Flex_Box";
import { restorePassword_api } from "../../apis";
import Alert_comp from "../../utilities/Alert_comp";
import return_error from "../../utilities/Return_Error";

const Forgot_pass = ({ navigation }) => {
  const theme = useSelector((state) => state?.themeReducer?.theme);
  const theme_config = theme == "light" ? light_theme : dark_theme;
  const { text_color, backgroundColor, shadowColor, grey } = theme_config;

  const selected_country = useSelector(
    (state) => state?.baseReducer?.selected_country
  );
  const { name, dial_code, flag, code } = selected_country;

  const [phoneNumber, setphoneNumber] = useState(null);
  const [loading, setloading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const validatePhoneNumber = (number) => {
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');
    // Check if number is valid length (10 digits)
    if (cleaned.length !== 10) {
      setPhoneError('Phone number must be 10 digits');
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

  const handlePhoneChange = (number) => {
    // Remove formatting for validation
    const cleanedNumber = number.replace(/\D/g, '');
    validatePhoneNumber(cleanedNumber);
    setphoneNumber(cleanedNumber);
  };

  const restorePassword = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }
    setloading(true);
    restorePassword_api({
      phoneNumber: dial_code?.replace("+", "") + phoneNumber,
    })
      .then((res) => {
        console.log(res.data);
        setloading(false);
        navigation.navigate("req_sent", { phoneNumber });
      })
      .catch((err) => {
        setloading(false);
        Alert_comp(return_error(err));
      });
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
        <Flex_Box
          style={{
            justifyContent: "space-between",
            marginTop: 50,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: theme_color,
            }}
          >
            OpHop.
          </Text>

          <Button_Comp
            btn_style={{
              backgroundColor: "#fff",
              justifyContent: "flex-end",
              paddingRight: 10,
              width: 100,
            }}
            text_style={{
              color: theme_color,
              fontWeight: 500,
              fontSize: 15,
              textAlign: "right",
            }}
            onClick={() => {
              navigation.navigate("Login");
            }}
            label={"Back to login"}
          />
        </Flex_Box>
        <Text
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: "#000",
            marginTop: 5,
          }}
        >
          Forgot your Password?
        </Text>
        <Text style={{ fontSize: 18, color: "#000" }}>
          Enter your phone below, we'll send you an email
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
          placeholder={"(XXX) XXX-XXXX"}
          value={formatPhoneNumberDisplay(phoneNumber)}
          onchange={handlePhoneChange}
          prefix={
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate("County Picker");
              }}
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
            </TouchableOpacity>
          }
        />
        {phoneError ? (
          <Text style={{ color: 'red', marginTop: 5, fontSize: 14 }}>{phoneError}</Text>
        ) : null}
        <Button_Comp
          btn_style={{
            marginTop: 30,
          }}
          label={"Continue"}
          loading={loading}
          onClick={restorePassword}
        />
      </Scroll_Comp>
    </>
  );
};

export default Forgot_pass;
