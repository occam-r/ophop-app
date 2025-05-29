import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Flex_Box from "../../../../utilities/Flex_Box";
import Form_Item from "../../../../utilities/Form_Item";
import Entypo from "react-native-vector-icons/Entypo";
import { light_theme, theme_color } from "../../../../utilities/colors";
import Feather from "react-native-vector-icons/Feather";
import {
  convert_into_base64,
  docPicker,
} from "../../../../utilities/Img_Picker";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "@react-native-firebase/storage";
import { set_loading_action } from "../../../../redux_prog/actions/base_action";
import { useDispatch, useSelector } from "react-redux";
import { compress_img } from "../../../../utilities/utilities";
import Modal_Comp from "../../../../utilities/Modal_Comp";
import { VisionCamera } from "./VisionCamera";
import Button_Comp from "../../../../utilities/Button_Comp";
import ImageCropPicker from "react-native-image-crop-picker";
import Bottom_Drawer from "../../../../utilities/Bottom_Drawer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { messages_api, store_message_api } from "../../../../apis";

const ChatInput = ({ send_message, receiver_id,room_id }) => {
  const { grey, backgroundColor, light_grey } = light_theme;
  const { token } = useSelector((state) => state?.authReducer);
  const [message, setmessage] = useState("");
  const [modalVisible, setmodalVisible] = useState(false);
  const [camera_open, setcamera_open] = useState(false);
  const [index_change_func, setindex_change_func] = useState(() => {});
  const dispatch = useDispatch();
  const storage = getStorage();

  const upload_img = async (base64, name) => {
    dispatch(set_loading_action(true));
    const storageRef = ref(storage, name);
    uploadString(storageRef, base64, "data_url")
      .then((snapshot) => {
        get_image(name);
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.warn(err);
      });
  };

  const get_image = (name) => {
    getDownloadURL(ref(storage, name))
      .then((url) => {
        console.warn (url)
        messages_api(receiver_id, {message,image:url }, token)
                .then((res) => {
                  console.warn(res.data);
                })
                .catch((err) => {
                  console.warn(err);
                });

                store_message_api(room_id, {message,image:url }, token)
                .then((res) => {
                  console.warn(res.data);
                })
                .catch((err) => {
                  console.warn(err);
                });
      })
      .catch((error) => {
        dispatch(set_loading_action(false));
      });
  };

  return (
    <>
      <Flex_Box
        style={{
          flexDirection: "row",
          gap: 10,
          justifyContent: "start",
          position: "absolute",
          bottom: 0,
          paddingVertical: 10,
          paddingLeft: 10,
          borderTopWidth: 1,
          borderTopColor: light_grey,
        }}
      >
        <Form_Item
          placeholder={"Enter Message"}
          suffix={
            <TouchableOpacity
              onPress={() => {
                setmodalVisible(true);
                index_change_func(1);
              }}
            >
              <Entypo name="attachment" size={20} color={grey} />
            </TouchableOpacity>
          }
          style={{
            width: "80%",
          }}
          input_style={{
            height: 50,
          }}
          value={message}
          onchange={(e) => {
            setmessage(e);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            if (message) {
              // send_message({ message }, () => {
              messages_api(receiver_id, { message,image:"" }, token)
                .then((res) => {
                  console.warn(res.data);
                })
                .catch((err) => {
                  console.warn(err);
                });

                store_message_api(room_id, { message,image:"" }, token)
                .then((res) => {
                  console.warn(res.data);
                })
                .catch((err) => {
                  console.warn(err);
                });
              setmessage("");
              // });
            }
          }}
        >
          <Flex_Box
            style={{
              width: "",
              backgroundColor: theme_color,
              padding: 12,
              borderRadius: 5,
            }}
          >
            <Feather name="send" size={23} color={backgroundColor} />
          </Flex_Box>
        </TouchableOpacity>
      </Flex_Box>
      {/* {modalVisible && ( */}
      <Bottom_Drawer
        snap_points={["1%", "15%"]}
        label={<></>}
        handleChange={(index) => {
          console.warn(index);
        }}
        setindex_change_func={setindex_change_func}
      >
        <Flex_Box
          style={{
            flexDirection: "row",
            gap: 20,
            marginTop: -8,
            position: "relative",
            paddingLeft: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              ImageCropPicker.openCamera({
                width: 300,
                height: 400,
                cropping: false,
              }).then(async (image) => {
                console.warn(image);
                const result = await fetch(`${image.path}`);
                const data = await result.blob();

                convert_into_base64(data, (base64) => {
                  upload_img(
                    base64,
                    image.path?.split("/")[image.path?.split("/")?.length - 1]
                  );
                  setmodalVisible(false);
                });
              });
              index_change_func(0);
            }}
          >
            <Flex_Box
              style={{
                width: "",
              }}
            >
              <MaterialCommunityIcons
                name="camera"
                size={52}
                color={theme_color}
              />
              <Text
                style={{
                  color: "#000",
                }}
              >
                Camera
              </Text>
            </Flex_Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              docPicker((base64, name) => {
                console.warn("========>");
                console.warn(base64);
                console.warn("========>");

                upload_img(base64, name);
                setmodalVisible(false);
              });
              index_change_func(0);
            }}
          >
            <Flex_Box
              style={{
                width: "",
              }}
            >
              <Flex_Box
                style={{
                  height: 52,
                  width: "",
                }}
              >
                <FontAwesome name="picture-o" size={43} color={theme_color} />
              </Flex_Box>
              <Text
                style={{
                  color: "#000",
                }}
              >
                Gallery
              </Text>
            </Flex_Box>
          </TouchableOpacity>
        </Flex_Box>
      </Bottom_Drawer>
      {/* )} */}
      {/* <Modal_Comp modalVisible={modalVisible} setModalVisible={setmodalVisible}>
        
      </Modal_Comp> */}
    </>
  );
};

export default ChatInput;
