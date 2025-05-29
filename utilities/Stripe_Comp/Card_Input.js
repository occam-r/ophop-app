import { CardField } from "@stripe/stripe-react-native";
import PaymentScreen from "./Payment_Page";

const { Text, TouchableOpacity } = require("react-native");
const { TextInput } = require("react-native");
const { Image } = require("react-native");
const { View } = require("react-native");
const { default: SelectDropdown } = require("react-native-select-dropdown");
const { useSelector } = require("react-redux");
const { light_theme } = require("../colors");
const { dark_theme } = require("../colors");

const Card_Input = ({
  input_style,
  icon,
  label,
  select,
  suffix,
  select_arr,
  value,
  onchange,
  keyboardType,
  style,
  disabled,
  onClick,
  placeholder,
  is_password,
  prefix,
  error,
}) => {
  const input_style_obj = input_style || {};
  const theme = useSelector((state) => state?.themeReducer?.theme);
  const { text_color, backgroundColor, shadowColor, grey, light_grey } =
    light_theme;
  const style_obj = style || {};

  const error_inp_style = error
    ? {
        borderColor: "red",
        borderWidth: 2,
      }
    : {};

  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        width: "100%",
        flexDirection: "row",
        position: "relative",
        // marginBottom: 35,
        ...style_obj,
      }}
    >
      {icon && (
        <>
          <Image
            source={icon}
            style={{
              width: 13,
              height: 13,
              position: "absolute",
              top: 2,
              left: 25,
            }}
          />
          <View
            style={{
              width: "18%",
            }}
          ></View>
        </>
      )}

      <View
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          width: "100%",
        }}
      >
        {label && (
          <Text
            style={{
              color: text_color,
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {label}
          </Text>
        )}
        {!select && (
          <TouchableOpacity
            onPress={() => {
              if (onClick) {
                onClick();
              }
            }}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              alignItems: "center",
              backgroundColor: light_grey,
              // borderColor: grey,
              // borderWidth: 1,
              marginTop: label ? 5 : 0,
              borderRadius: 10,
              ...error_inp_style,
            }}
          >
            {prefix || null}
            <CardField
              postalCodeEnabled={true}
              placeholders={{
                number: "4242 4242 4242 4242",
              }}
              cardStyle={{
                backgroundColor: light_grey,
                textColor: "#000000",
                placeholderColor: 'grey' 
                //   borderWidth:2
              }}
              style={{
                width: "100%",
                height: 50,
                backgroundColor: "#F7F6F6",
                //   marginVertical: 30,
              }}
              onCardChange={onchange}
            />
            {suffix || null}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Card_Input;
