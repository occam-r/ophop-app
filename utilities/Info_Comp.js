import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { dark_theme, light_theme } from "./colors";

const Info_Comp = ({ label, info, has_phone, icon, style, phone }) => {

    const theme = useSelector(state => state?.themeReducer?.theme);
    const theme_config = theme == 'light' ? light_theme : dark_theme;
    const { text_color, backgroundColor, shadowColor, grey } = theme_config;
    const style_obj = style || {};

    return (
        <View
            style={{
                width: "100%",
                display: "flex",
                width: "100%",
                flexDirection: "row",
                position: "relative",
                marginTop: 30,
                ...style_obj
            }}
        >

            <Image
                source={icon}
                style={{
                    width: 13,
                    height: 13,
                    position: "absolute",
                    top: 2,
                    left: 20
                }}
            />
            {
                has_phone &&
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        bottom: 2,
                        right: 20
                    }}
                    onPress={() => {
                        if (phone) {
                            Linking.openURL(`tel:${phone}`)
                        }
                    }}
                >
                    <Image
                        source={require("../images/phone_icon_green.png")}
                        style={{
                            width: 13,
                            height: 13,
                        }}
                    />
                </TouchableOpacity>
            }
            <View
                style={{
                    width: "18%"
                }}
            >
            </View>
            <View
                style={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "start"
                }}
            >
                <Text
                    style={{
                        color: grey,
                        fontSize: 13,
                        fontWeight: 500
                    }}
                >
                    {label}
                </Text>
                <Text
                    style={{
                        color: text_color,
                        fontSize: 17,
                        fontWeight: 500
                    }}
                >
                    {info}
                </Text>
            </View>
        </View>
    )
};

export default Info_Comp;