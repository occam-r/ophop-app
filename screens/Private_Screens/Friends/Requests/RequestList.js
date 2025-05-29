import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Flex_Box from "../../../../utilities/Flex_Box";
import {
  Not_Found_Text,
  getUserInitials,
} from "../../../../utilities/utilities";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Entypo from "react-native-vector-icons/Entypo";
import { light_theme } from "../../../../utilities/colors";
import {
  acccept_request_api,
  get_contacts_api,
  get_requests_api,
  reject_request_api,
} from "../../../../apis";
import return_error from "../../../../utilities/Return_Error";
import { useIsFocused } from "@react-navigation/native";
import Alert_comp, { confirm_Alert } from "../../../../utilities/Alert_comp";
import { set_contacts_action } from "../../../../redux_prog/actions/base_action";

const RequestList = ({ navigation }) => {
  const { token } = useSelector((state) => state?.authReducer);
  const { text_color, grey, dark_grey } = light_theme;
  const IsFocused = useIsFocused();
  const dispatch = useDispatch();

  const [request_arr, setrequest_arr] = useState([]);

  const get_contacts = () => {
    get_contacts_api(token)
      .then((res) => {
        dispatch(set_contacts_action(res.data.data.contacts));
        console.warn(res.data);
      })
      .catch((err) => {
        console.error(return_error(err));
      });
  };

  const get_requests = () => {
    get_requests_api(token)
      .then((res) => {
        setrequest_arr(res.data?.data?.searchResults);
      })
      .catch((err) => {
        console.error(return_error(err));
      });
  };

  useEffect(get_requests, [IsFocused]);

  const accept_request = (id) => {
    acccept_request_api(id, token)
      .then((res) => {
        Alert_comp("Success", "Request accepted successfully!");
        setrequest_arr(
          request_arr?.filter((el) => {
            return el?.id != id;
          })
        );
        get_contacts();
      })
      .catch((err) => {
        console.error(return_error(err));
      });
  };

  const reject_request = (id) => {
    reject_request_api(id, token)
      .then((res) => {
        Alert_comp("Success", "Request rejected successfully!");
        setrequest_arr(
          request_arr?.filter((el) => {
            return el?.id != id;
          })
        );
      })
      .catch((err) => {
        console.error(return_error(err));
      });
  };

  return (
    <>
      {request_arr?.length == 0 && (
        <Not_Found_Text text={`You don't have any requests!`} />
      )}
      {request_arr?.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{
            width: "100%",
          }}
          contentContainerStyle={{
            width: "100%",
            // marginTop: 5,
          }}
          data={request_arr}
          renderItem={({ item, index }) => {
            return (
              <Flex_Box
                style={{
                  justifyContent: "space-between",
                  paddingHorizontal: 15,
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderBottomColor: grey,
                  paddingVertical: 10,
                }}
              >
                <Flex_Box
                  style={{
                    width: "",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Flex_Box
                    style={{
                      backgroundColor: item?.avatarBackground,
                      borderRadius: 50,
                      height: 40,
                      width: 40,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 600,
                        fontSize: 18,
                      }}
                    >
                      {getUserInitials(item?.contactName)}
                    </Text>
                  </Flex_Box>
                  <Text
                    style={{
                      color: text_color,
                      fontWeight: 500,
                      fontSize: 16,
                    }}
                  >
                    {item?.contactName}
                  </Text>
                </Flex_Box>
                <Flex_Box
                  style={{
                    flexDirection: "row",
                    width: "",
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      confirm_Alert(
                        "Accept!",
                        "Do you want to accept this request?",
                        () => {
                          accept_request(item?.id);
                        }
                      );
                    }}
                  >
                    <Flex_Box
                      style={{
                        width: "",
                        borderRadius: 50,
                        padding: 10,
                        backgroundColor: "#4EA64C",
                      }}
                    >
                      <FontAwesome6 name="check" size={15} color="#fff" />
                    </Flex_Box>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      confirm_Alert(
                        "Reject!",
                        "Do you want to reject this request?",
                        () => {
                          reject_request(item?.id);
                        }
                      );
                    }}
                  >
                    <Flex_Box
                      style={{
                        width: "",
                        borderRadius: 50,
                        padding: 7,
                        backgroundColor: "#EC72A5",
                      }}
                    >
                      <Entypo name="cross" size={22} color="#fff" />
                    </Flex_Box>
                  </TouchableOpacity>
                </Flex_Box>
              </Flex_Box>
            );
          }}
        />
      )}
    </>
  );
};

export default RequestList;
