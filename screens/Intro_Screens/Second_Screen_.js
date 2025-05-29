import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { dark_theme, light_theme, theme_color } from '../../utilities/colors';

const Second_Screen_Item = ({ func, icon, label, sub_text, slide_num, total_slides, prev_func }) => {

    const theme = useSelector(state => state?.themeReducer?.theme);
    const theme_config = theme == 'light' ? light_theme : dark_theme;
    const { text_color, backgroundColor, shadowColor, grey } = theme_config;

    function createArrayUpTo(limit) {
        let result = [];
        for (let i = 1; i <= limit; i++) {
            result.push(i);
        }
        return result;
    };

    const slide_arr = createArrayUpTo(total_slides);

    return (
        <View
            style={{
                // flex: 1,
                backgroundColor,
                display: "flex",
                alignItems: "center",
                justifyContent: 'space-between',
                // gap: 40,
                marginTop: "30%",
                height:"56%"
                // paddingBottom: 25
            }}
        >
            <Image source={require("../../images/svgviewer-png-output.png")}
                style={{
                    height: 250,
                    width: 250,
                    objectFit: "cover"
                }}
            />
            <View
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                    marginTop:"9%"
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
                    {label}
                </Text>
                <Text
                    style={{
                        color: text_color,
                        fontSize: 14,
                        width: "80%",
                        textAlign: "center"
                    }}
                >
                    {sub_text}
                </Text>
            </View>

            <View
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <View
                    style={{
                        width: "60%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 8
                    }}
                >
                    {
                        slide_arr.length > 0 &&
                        slide_arr.map((el, index) => {
                            return <View
                                style={{
                                    height: 5,
                                    borderRadius: 5,
                                    width: (100 / slide_arr.length) + "%",
                                    backgroundColor: (slide_num == (index + 1)) ? theme_color : grey
                                }}
                            ></View>
                        })
                    }
                </View>
            </View>

            {/* <View
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 20
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: theme_color,
                        padding: 15,
                        borderRadius: 50,
                        display: "flex",
                        // width: "80%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row"
                    }}
                    onPress={prev_func}
                >
                    <Image
                        source={require("../../images/right_arrow_long.png")}
                        style={{
                            height: 40,
                            width: 40,
                            transform: 'scaleX(-1)'
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: theme_color,
                        padding: 15,
                        borderRadius: 50,
                        display: "flex",
                        // width: "80%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row"
                    }}
                    onPress={func}
                >
                    <Image
                        source={slide_num == total_slides ? require("../../images/tick_icon.png") : require("../../images/right_arrow_long.png")}
                        style={{
                            height: 40,
                            width: 40
                        }}
                    />
                </TouchableOpacity>
            </View> */}
        </View>
    )
}

export default Second_Screen_Item