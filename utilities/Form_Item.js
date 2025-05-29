const { Text, TouchableOpacity } = require("react-native");
const { TextInput } = require("react-native");
const { Image } = require("react-native");
const { View } = require("react-native");
const { default: SelectDropdown } = require("react-native-select-dropdown");
const { useSelector } = require("react-redux");
const { light_theme } = require("./colors");
const { dark_theme } = require("./colors");

const Form_Item = ({
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
        {select && (
          <SelectDropdown
            defaultValue={value || {}}
            data={select_arr}
            onSelect={(selectedItem, index) => {
              onchange(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // The text to show after item is selected
              return selectedItem.label;
            }}
            rowTextForSelection={(item, index) => {
              // The text to show in dropdown list
              return item.label;
            }}
            buttonStyle={{
              backgroundColor: light_grey,
              borderRadius: 10,
              width: "100%",
              height: 40,
              marginTop: label ? 5 : 0,
              ...error_inp_style,
            }}
            buttonTextStyle={{ color: text_color, fontSize: 16 }}
            dropdownStyle={{
              backgroundColor: backgroundColor,
              borderRadius: 5,
            }}
            rowTextStyle={{ color: text_color }}
            dropdownTextStyle={{ color: text_color }}
            defaultButtonText={
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                  // width:"100%",
                  // backgroundColor:"red"
                }}
              >
                <Text style={{ color: grey }}>Select an option</Text>
                <Image
                  style={{
                    width: 17,
                    height: 17,
                    marginTop: 5,
                    opacity: theme == "light" ? 0.25 : 1,
                  }}
                  source={
                    theme == "light"
                      ? require("../images/down_arrow.png")
                      : require("../images/down_arrow_white.png")
                  }
                />
              </View>
            }
          />
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
            <TextInput
              style={{
                color: text_color,

                width: suffix || prefix ? "88%" : "100%",
                borderRadius: 10,
                height: 40,
                fontSize: 16,
                paddingLeft: 10,
                backgroundColor: light_grey,
                ...input_style_obj,
                // fontWeight:500
              }}
              placeholder={placeholder || ""}
              placeholderTextColor={grey}
              editable={disabled == "true" ? false : true}
              selectTextOnFocus={disabled == "true" ? false : true}
              // value={value || ''}
              defaultValue={value || ""}
              onChangeText={onchange}
              keyboardType={keyboardType || ""}
              secureTextEntry={is_password || false}
            />
            {suffix || null}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Form_Item;
