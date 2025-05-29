import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { dark_theme, light_theme } from '../utilities/colors';
import { countries } from '../utilities/countries';
import { set_country_action } from '../redux_prog/actions/base_action';

const County_Picker = ({ navigation }) => {

    const [filter_val, setfilter_val] = useState('');
    const [country_arr, setcountry_arr] = useState([]);

    useEffect(() => {
        if (filter_val) {
            setcountry_arr(
                countries.filter((el) => {
                    return (el.name.toLowerCase().includes(filter_val.toLowerCase()) || el.code.toLowerCase().includes(filter_val.toLowerCase()));
                })
            )
        }
        else {
            setcountry_arr(countries);
        }
    }, [filter_val]);


    const theme = useSelector(state => state?.themeReducer?.theme);
    const theme_config = theme == 'light' ? light_theme : dark_theme;
    const { text_color, backgroundColor, shadowColor, grey } = theme_config;

    const dispatch = useDispatch();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor,
                padding: 20
            }}
        >
            <View
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    width: "100%",
                    gap: 20
                }}
            >
                <View
                    style={{
                        width: "80%",
                        backgroundColor: '#c9c9c9',
                        height: 45,
                        borderRadius: 7,
                        display: "flex",
                        justifyContent: "start",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 10,
                        gap: 5
                    }}
                >
                    <Image
                        source={require("../images/search.png")}
                        style={{
                            height: 20,
                            width: 20,
                        }}
                    />
                    <TextInput
                        style={{
                            width: "90%"
                        }}
                        value={filter_val}
                        onChangeText={(e) => {
                            setfilter_val(e);
                        }}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Image
                        source={require("../images/cross.png")}
                        style={{
                            height: 28,
                            width: 28,
                            backgroundColor: "#fff",
                            borderRadius: 50
                        }}
                    />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flex: 1
                }}
            >
                {
                    country_arr.length > 0 &&
                    <FlatList
                        data={country_arr}
                        renderItem={({ item }) => {
                            const el = item;
                            return (
                                <TouchableOpacity
                                    // key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        width: "100%",
                                        paddingLeft: 15,
                                        paddingRight: 25,
                                        paddingVertical: 22,
                                        borderBottomColor: text_color,
                                        borderBottomWidth: 0.5
                                    }}
                                    onPress={() => {
                                        dispatch(set_country_action(el));
                                        navigation.goBack();
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: text_color,
                                            width: "80%"
                                        }}
                                    >
                                        {el?.flag} &nbsp; {el?.name}
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: text_color
                                        }}
                                    >
                                        {el?.dial_code}
                                    </Text>

                                </TouchableOpacity>
                            )
                        }
                        }
                        keyExtractor={item => item.code}
                    />
                }
                {/* <ScrollView>
                    {
                        country_arr.length > 0 &&
                        country_arr.map((el, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        width: "100%",
                                        paddingLeft: 15,
                                        paddingRight: 25,
                                        paddingVertical: 22,
                                        borderBottomColor: text_color,
                                        borderBottomWidth: 0.5
                                    }}
                                    onPress={() => {
                                        dispatch(set_country_action(el));
                                        navigation.navigate('Login');
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: text_color,
                                            width: "80%"
                                        }}
                                    >
                                        {el.flag} &nbsp; {el.name}
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: text_color
                                        }}
                                    >
                                        {el.dial_code}
                                    </Text>

                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView> */}
            </View>
        </View>
    )
}

export default County_Picker