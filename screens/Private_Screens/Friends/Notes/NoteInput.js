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
import { post_notes_api } from "../../../../apis";
import { useSelector } from "react-redux";
import Alert_comp from "../../../../utilities/Alert_comp";
import return_error from "../../../../utilities/Return_Error";
import Bottom_Drawer from "../../../../utilities/Bottom_Drawer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ImageCropPicker from "react-native-image-crop-picker";

const NoteInput = ({ notes, setnotes }) => {
  const { grey, backgroundColor, light_grey } = light_theme;
  const { token } = useSelector((state) => state?.authReducer);
  const [index_change_func, setindex_change_func] = useState(() => {});

  const [message, setmessage] = useState("");

  const post_notes = (data) => {
    post_notes_api(data, token)
      .then((res) => {
        if (res.data?.status == true) {
          setnotes([...notes, res?.data?.data]);
          setmessage("");
        }
      })
      .catch((err) => {
        console.error(return_error(err));
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
          backgroundColor,
        }}
      >
        <Form_Item
          placeholder={"Enter Message"}
          suffix={
            <TouchableOpacity
              onPress={() => {
                // setmodalVisible(true);
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
              post_notes({
                message,
              });
            } else {
              Alert_comp("Error", "Please enter text!");
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
      <Bottom_Drawer
        snap_points={["1%", "20%"]}
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
                  post_notes({
                    message: "",
                    image: base64,
                  });
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
                post_notes({
                  message: "",
                  image: base64,
                });
                // setmodalVisible(false);
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
    </>
  );
};

export default NoteInput;
