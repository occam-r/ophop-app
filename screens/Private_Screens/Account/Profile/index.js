import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Sidebar_Toggle_Bar } from "../../../Sidebar/Sidebar_Toggle";
import { light_theme, theme_color } from "../../../../utilities/colors";
import Form_Item from "../../../../utilities/Form_Item";
import Flex_Box from "../../../../utilities/Flex_Box";
import { useIsFocused } from "@react-navigation/native";
import {
  get_profile_details_api,
  get_states_api,
  upd_user_details_api,
} from "../../../../apis";
import return_error from "../../../../utilities/Return_Error";
import { useDispatch, useSelector } from "react-redux";
import Button_Comp from "../../../../utilities/Button_Comp";
import Alert_comp from "../../../../utilities/Alert_comp";
import { set_user_action } from "../../../../redux_prog/actions/auth_action";
import { set_loading_action } from "../../../../redux_prog/actions/base_action";
import BottomBar from "../../../BottomBar";

const Set_Profile = ({ navigation }) => {
  const { backgroundColor, text_color, grey } = light_theme;
  const { token } = useSelector((state) => state?.authReducer);
  const { is_loading } = useSelector((state) => state?.baseReducer);
  const [state_options, setstate_options] = useState([]);
  const genderOptions = [
    { value: 1, label: "Rather not tell" },
    { value: 2, label: "Male" },
    { value: 3, label: "Female" },
    { value: 4, label: "Custom" },
  ];
  const user = useSelector((state) => state?.authReducer?.user_data);
  const dispatch = useDispatch();

  const IsFocused = useIsFocused();

  const get_states = () => {
    get_states_api(token)
      .then((res) => {
        setstate_options(
          res.data?.data?.states?.map((el) => {
            return {
              value: el?.id,
              label: el?.name,
            };
          })
        );
      })
      .catch((err) => {
        console.error(return_error(err));
      });
  };

  const get_profile_details = () => {
    get_profile_details_api(token)
      .then((res) => {
        // console.warn(res.data.data);
        dispatch(set_user_action({
          ...user,
          ...res.data.data
        }));
        setuser_data(res.data.data);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  useEffect(() => {
    get_states();
    get_profile_details();
    // console.warn({user});
  }, [IsFocused]);

  const [user_data, setuser_data] = useState({
    username: null,
    phoneNumber: null,
    email: null,
    stateId: null,
    age: null,
    genderId: null,
    customGender: null,
    preferredPronouns: null,
    ...user,
  });

  const {
    username,
    phoneNumber,
    email,
    stateId,
    age,
    genderId,
    customGender,
    preferredPronouns,
  } = user_data;

  const upd_user_data = (val_obj) => {
    setuser_data({
      ...user_data,
      ...val_obj,
    });
  };

  const upd_profile = () => {
    dispatch(set_loading_action(true));
    upd_user_details_api(
      {
        username,
        phoneNumber: phoneNumber == user?.phoneNumber ? null : phoneNumber,
        email: email == user?.email ? null : email,
        stateId,
        age,
        genderId,
        customGender,
        preferredPronouns,
      },
      token
    )
      .then((res) => {
        dispatch(set_loading_action(false));
        if (res.data?.status == true) {
          dispatch(
            set_user_action({
              ...user_data,
              ...res.data?.data,
            })
          );
        }
        Alert_comp("Success", 'Profile updated successfully!');
        navigation?.goBack();
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.error(JSON.stringify(err));
        Alert_comp("Error", return_error(err));
      });
  };

  return (
    <>
      <Sidebar_Toggle_Bar
        func={() => {
          navigation.goBack();
        }}
        sub_route={true}
        label={"Account"}
      />
      <View
        style={{
          flex: 1,
          backgroundColor,
          paddingBottom: 60,
        }}
      >
        <ScrollView
          style={{
            padding: 10,
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: text_color,
            }}
          >
            Your Profile
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: grey,
            }}
          >
            Your account has been verified
          </Text>
          <Form_Item
            style={{
              marginTop: 10,
            }}
            label={"Username"}
            value={username}
            onchange={(e) => {
              upd_user_data({
                username: e,
              });
            }}
          />
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Form_Item
              style={{
                width: "48%",
              }}
              label={"Email"}
              value={email}
              onchange={(e) => {
                upd_user_data({
                  email: e,
                });
              }}
            />
            <Form_Item
              style={{
                width: "48%",
              }}
              label={"Phone Number"}
              keyboardType={"numeric"}
              value={phoneNumber}
              onchange={(e) => {
                upd_user_data({
                  phoneNumber: e,
                });
              }}
            />
          </Flex_Box>
          <Form_Item
            style={{
              marginTop: 10,
            }}
            label={"State"}
            select={true}
            select_arr={state_options || []}
            value={
              state_options?.filter((li) => {
                return li.value == stateId;
              })[0]
            }
            onchange={(e) => {
              upd_user_data({
                stateId: e.value,
              });
            }}
          />
          <Flex_Box
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Form_Item
              style={{
                width: "48%",
              }}
              label={"Preferred Pro-Nouns"}
              value={preferredPronouns}
              onchange={(e) => {
                upd_user_data({
                  preferredPronouns: e,
                });
              }}
            />
            <Form_Item
              style={{
                width: "48%",
              }}
              label={"Age"}
              keyboardType={"numeric"}
              value={age ? JSON.stringify(age) : ""}
              onchange={(e) => {
                upd_user_data({
                  age: e,
                });
              }}
            />
          </Flex_Box>
          <Form_Item
            style={{
              marginTop: 10,
            }}
            label={"Gender"}
            select={true}
            select_arr={genderOptions}
            value={
              genderOptions?.filter((li) => {
                return li.value == genderId;
              })[0]
            }
            onchange={(e) => {
              upd_user_data({
                genderId: e.value,
              });
            }}
          />
          {genderId == 4 && (
            <Form_Item
              style={{
                marginTop: 10,
              }}
              label={"Customer Gender"}
              value={customGender}
              onchange={(e) => {
                upd_user_data({
                  customGender: e,
                });
              }}
            />
          )}
          <Button_Comp
            label={"Save"}
            btn_style={{
              paddingVertical: 14,
              marginTop: 10,
            }}
            onClick={upd_profile}
            loading={is_loading}
          />
        </ScrollView>
      </View>
      <BottomBar navigation={navigation} />
    </>
  );
};

export default Set_Profile;
