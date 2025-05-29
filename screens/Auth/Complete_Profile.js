import { View, Text, Image, ActivityIndicator, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { dark_theme, light_theme, theme_color } from '../../utilities/colors';
import Form_Item from '../../utilities/Form_Item';
import { useRoute } from "@react-navigation/native"
import Alert_comp from '../../utilities/Alert_comp';
import { login_action, set_token_action, set_user_action } from '../../redux_prog/actions/auth_action';
import { get_school_ddl_api, login_via_token_api } from '../../apis';
import { set_school_ddl_action } from '../../redux_prog/actions/base_action';

const Complete_Profile = ({ navigation }) => {

    const route = useRoute()
    const { type, email, phone } = route.params;

    const school_ddl_options = useSelector(state => state?.baseReducer?.school_ddl_options);
    const authReducer = useSelector(state => state?.authReducer);
    const { token, login_type,user_data } = authReducer;
    const theme = useSelector(state => state?.themeReducer?.theme);
    const theme_config = theme == 'light' ? light_theme : dark_theme;
    const { text_color, backgroundColor, shadowColor, grey } = theme_config;

    const [name, setname] = useState('');
    const [email_text, setemail_text] = useState(email || '');
    const [phone_text, setphone_text] = useState(phone || '');
    const [logging_in, setlogging_in] = useState(false);
    const [selected_School, setselected_School] = useState('');
    // const is_Email = type == 'Email';
    const role = login_type == 'Driver' ? 3 : 4;
    const dispatch = useDispatch();

    const signup = () => {
        if (name && (email || phone)) {
            setlogging_in(true);
            login_via_token_api({ device_name: Platform.constants.Brand + '-' + Platform.constants.Model, token, email: email_text, phone: phone_text, name, role, school_id: selected_School?.id }).
                then((res) => {
                    setlogging_in(false);
                    dispatch(set_user_action({
                        ...res.data,
                        ...user_data
                    }));
                    dispatch(set_token_action('Bearer '+res.data.token?.split("|")[1]));
                    // console.warn({ res: res.data });
                    // dispatch(login_action());
                    navigation.navigate('Subscription');
                })
                .catch((err) => {
                    setlogging_in(false);
                    console.warn({ type: 'App API', err });
                })
        }
        else {
            Alert_comp('Invalid Credentials', 'Please enter proper details');
        }
    };

    const get_school_ddl_options = () => {
        get_school_ddl_api().then((res) => {
            const new_arr = res.data.map((el) => {
                return {
                    label: el.name,
                    value: el.id,
                    id: el.id
                }
            });
            dispatch(set_school_ddl_action(new_arr));
        }).catch((err) => {
            console.error(err);
        });
    };

    useEffect(get_school_ddl_options, []);


    return (
        <View
            style={{
                flex: 1,
                backgroundColor,
                alignItems: "center",
                justifyContent: "center",
                // gap: 40
            }}
        >
            <Image
                source={require('../../images/image_2024_02_23T11_01_34_555Z.png')}
                style={{
                    height: 70,
                    width: 140,
                    marginBottom: 20
                }}
            />
            <Text
                style={{
                    color: text_color,
                    fontSize: 26,
                    fontWeight: 600,
                    marginBottom: 20
                }}
            >
                Complete Profile
            </Text>
            <Form_Item
                icon={require("../../images/user_green.png")}
                label={'Name'}
                value={name}
                onchange={(e) => setname(e)}
            />
            <Form_Item
                icon={require("../../images/mail_circle.png")}
                label={'Email'}
                value={email_text}
                onchange={(e) => setemail_text(e)}
            />
            <Form_Item
                icon={require("../../images/phone_icon_green.png")}
                label={'Phone'}
                value={phone_text}
                onchange={(e) => setphone_text(e)}
                keyboardType={'numeric'}
            />

            <Form_Item
                icon={require("../../images/children_icon.png")}
                label={'Select School'}
                select={true}
                select_arr={school_ddl_options}
                onchange={(e) => {
                    console.warn({ e });
                    setselected_School(e);
                }}
            />
            <View
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: 10,
                    flexWrap: "wrap"
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: theme_color,
                        paddingVertical: 11,
                        borderRadius: 10,
                        display: "flex",
                        width: "80%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        opacity: logging_in ? 0.5 : 1
                    }}
                    onPress={() => {
                        signup();
                    }}
                >
                    {
                        logging_in &&
                        <ActivityIndicator size="small" color="#fff" />
                    }
                    {
                        !logging_in &&
                        <Text style={{
                            color: "#fff",
                            // fontWeight: 500
                            fontSize: 14
                        }}>
                            SIGN UP
                        </Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Complete_Profile