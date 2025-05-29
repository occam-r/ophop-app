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
import req_Sent_icon from "../../images/req_sent_img.png";

const Request_sent = ({ navigation, route }) => {
  const theme = useSelector((state) => state?.themeReducer?.theme);
  const theme_config = theme == "light" ? light_theme : dark_theme;
  const { text_color, backgroundColor, shadowColor, grey } = theme_config;
  const [is_password, setis_password] = useState(false);
  
  // Get phone number from route params
  const phoneNumber = route?.params?.phoneNumber || '';
  const selected_country = useSelector((state) => state?.baseReducer?.selected_country);
  const { dial_code } = selected_country;

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
        <Flex_Box>
          <Flex_Box
            style={{
              paddingVertical: 20,
            }}
          >
            <Image
              source={require("../../images/req_sent_img.png")}
              style={{
                height: 200,
                width: 200,
              }}
            />
          </Flex_Box>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "#000",
              marginTop: 5,
            }}
          >
            Your request has been sent, check your messages to verify.
          </Text>
          <Text style={{ fontSize: 18, color: "#000", marginTop: 10 }}>
            We've sent a verification code to
          </Text>
          <Text style={{ 
            fontSize: 18, 
            color: "#000", 
            fontWeight: 600,
            letterSpacing: 0.5,
          }}>
            {dial_code} {formatPhoneNumberDisplay(phoneNumber)}
          </Text>
        </Flex_Box>
        <Button_Comp
          label={"Continue"}
          btn_style={{
            marginTop: 20,
          }}
          onClick={()=>{
            navigation.navigate("Verify Code", { phoneNumber });
          }}
        />
      </Scroll_Comp>
    </>
  );
};

export default Request_sent;
