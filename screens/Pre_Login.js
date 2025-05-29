import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { dark_theme, light_theme, theme_color } from '../utilities/colors';
import { set_login_type_action } from '../redux_prog/actions/auth_action';

const Pre_Login = ({ navigation }) => {

    const theme = useSelector(state => state?.themeReducer?.theme);
    const theme_config = theme == 'light' ? light_theme : dark_theme;
    const { text_color, backgroundColor, shadowColor, grey } = theme_config;

    const dispatch = useDispatch();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor,
                display: "flex",
                alignItems: "center",
                justifyContent: 'center',
                gap: 40
            }}
        >
            <View
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    // paddingVertical: 25,
                }}
            >
                <Image
                    source={require('../images/image_2024_02_23T11_01_34_555Z.png')}
                    style={{
                        height: 100,
                        width: 200
                    }}
                />
            </View>


            <View
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8
                }}
            >
                <Text
                    style={{
                        color: text_color,
                        fontWeight: 600,
                        fontSize: 22,
                        width: '80%',
                        textAlign: "center"
                    }}
                >
                    Choose Login Type
                </Text>
                <Text
                    style={{
                        color: text_color,
                        fontSize: 14
                    }}
                >
                    Choose your login if you are a School Admin or a Driver
                </Text>
            </View>


            <View
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: 'center',
                    gap: 15,
                    width: "100%"
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        dispatch(set_login_type_action('Driver'));
                        navigation.navigate("Login")
                    }}
                    style={{
                        backgroundColor: 'blue',
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: 'space-between',
                        paddingHorizontal: 15,
                        paddingVertical: 20,
                        width: "80%"
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 18,
                            fontWeight: 600
                        }}
                    >
                        Enter as a Driver
                    </Text>
                    <Image
                        source={require("../images/right_arrow_long.png")}
                        style={{
                            height: 30,
                            width: 30
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        dispatch(set_login_type_action('Parent'));
                        navigation.navigate("Login")
                    }}
                    style={{
                        backgroundColor: theme_color,
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: 'space-between',
                        paddingHorizontal: 15,
                        paddingVertical: 20,
                        width: "80%"
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 18,
                            fontWeight: 600
                        }}
                    >
                        Enter as a Parent
                    </Text>
                    <Image
                        source={require("../images/right_arrow_long.png")}
                        style={{
                            height: 30,
                            width: 30
                        }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Pre_Login