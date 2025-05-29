import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import { light_theme, light_theme_bg } from "../../../../utilities/colors";
import Flex_Box from "../../../../utilities/Flex_Box";
import Button_Comp from "../../../../utilities/Button_Comp";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import {
  convertDays,
  getDateDifference,
  Not_Found_Text,
  screen_height,
} from "../../../../utilities/utilities";
import { IMG_BASE_URL } from "../../../../apis/config";
import { delete_notes_api } from "../../../../apis";
import return_error from "../../../../utilities/Return_Error";
import { useSelector } from "react-redux";
import { confirm_Alert } from "../../../../utilities/Alert_comp";
import { formatTime } from "../../../../utilities/Map_utils";

const NotesList = ({ navigation, notes, setnotes }) => {
  const { backgroundColor, text_color, grey, dark_grey } = light_theme;

  const { token } = useSelector((state) => state?.authReducer);

  const delete_notes = (id) => {
    delete_notes_api(id, token)
      .then((res) => {
        setnotes(
          notes?.filter((el) => {
            return el?.id != id;
          })
        );
      })
      .catch((err) => {
        console.error(err);
        console.error(return_error(err));
      });
  };

  return (
    <View
      style={{
        flex:1,
        paddingBottom:80
      }}
    >
      {notes?.length == 0 && (
        <Not_Found_Text text={`You have no notes. Add some!`} />
      )}
      {notes?.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            //   flex: 1,
            backgroundColor,
            paddingHorizontal: 10,
          }}
          data={notes}
          renderItem={({ item, index }) => {
            const msg_time = getDateDifference(
              new Date(),
              new Date(item?.timeStamp)
            );
            return (
              <>
                <View
                  style={{
                    width: "80%",
                    borderRadius: 8,
                    backgroundColor: light_theme_bg,
                    padding: 15,
                    marginTop: 10,
                  }}
                >
                  {item?.shopId ? (
                    <>
                      <Flex_Box
                        style={{
                          flexDirection: "row",
                          gap: 4,
                        }}
                      >
                        <Text
                          style={{
                            color: dark_grey,
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          Tap button to view
                        </Text>
                        <Text
                          style={{
                            color: text_color,
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {item?.shopName}
                        </Text>
                      </Flex_Box>
                      <Button_Comp
                        label={"View"}
                        btn_style={{
                          paddingVertical: 12,
                          marginTop: 5,
                        }}
                        onClick={() => {
                          navigation?.navigate("Store Details", {
                            id: item?.shopId,
                          });
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Text
                        style={{
                          color: dark_grey,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {item?.messageText}
                      </Text>
                      {item?.image && (
                        <Image
                          source={{ uri: IMG_BASE_URL + item?.image }}
                          style={{
                            height: 80,
                            width: 80,
                          }}
                        />
                      )}
                    </>
                  )}
                  <Flex_Box
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: 10,
                      position: "relative",
                      paddingTop: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: text_color,
                        fontSize: 12,
                      }}
                    >
                      {/* {new Date(item?.timeStamp).getTime()} */}
                      {msg_time?.result_suffix == " days"
                        ? convertDays(msg_time?.diffInDays)
                        : msg_time?.result}{" "}
                      ago
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setnotes(
                          notes?.map((el, ind) => {
                            if (index == ind) {
                              return {
                                ...el,
                                deletemodal: item?.deletemodal ? false : true,
                              };
                            } else {
                              return {
                                ...el,
                                deletemodal: false,
                              };
                            }
                          })
                        );
                      }}
                    >
                      <Entypo
                        name="dots-three-vertical"
                        size={15}
                        color={grey}
                      />
                    </TouchableOpacity>
                    {item?.deletemodal && (
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          bottom: -10,
                          right: -85,
                        }}
                        onPress={() => {
                          confirm_Alert(
                            "Delete!",
                            " You want to delete this note?",
                            () => delete_notes(item?.id)
                          );
                        }}
                      >
                        <Flex_Box
                          style={{
                            flexDirection: "row",
                            gap: 5,
                            backgroundColor,
                            borderWidth: 1,
                            borderColor: grey,
                            borderRadius: 5,
                            paddingVertical: 5,
                            paddingRight: 5,
                            width: 80,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="delete-forever-outline"
                            size={20}
                            color="red"
                          />
                          <Text
                            style={{
                              color: text_color,
                              fontSize: 14,
                            }}
                          >
                            Delete
                          </Text>
                        </Flex_Box>
                      </TouchableOpacity>
                    )}
                  </Flex_Box>
                </View>
              </>
            );
          }}
        />
      )}
    </View>
  );
};

export default NotesList;
