import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Flex_Box from "./Flex_Box";
import { light_theme } from "./colors";
import DocumentPicker from "@react-native-documents/picker";

export const docPicker = async (func) => {
  // Pick a single file
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
    });
    base64File_url(res[0]?.uri, (base64) => {
      func(base64, res[0]?.name);
    });
  } catch { }
};

export const convert_into_base64 = (file, func) => {
  const reader = new FileReader();

  reader.onload = function (event) {
    const base64String = event.target.result;
    // console.log("Base64:", base64String);
    if (func) {
      func(base64String);
    }
    // You can use this base64String as needed
  };

  reader.onerror = function (event) {
    console.error("File could not be read! Code " + event.target.error.code);
  };

  reader.readAsDataURL(file);
};

export const base64File_url = async (uri, func) => {
  // return new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  // If successful -> return with blob
  xhr.onload = function () {
    convert_into_base64(xhr.response, func);
    // resolve(xhr.response);
  };

  // reject on error
  xhr.onerror = function () {
    // reject(new Error('uriToBlob failed'));
    console.log("blob failed");
  };

  // Set the response type to 'blob' - this means the server's response
  // will be accessed as a binary object
  xhr.responseType = "blob";

  // Initialize the request. The third argument set to 'true' denotes
  // that the request is asynchronous
  xhr.open("GET", uri, true);

  // Send the request. The 'null' argument means that no body content is given for the request
  xhr.send(null);
  // });
};

const Img_Picker = ({ onChange }) => {
  const { grey, dark_grey } = light_theme;

  return (
    <TouchableOpacity
      style={{
        paddingTop: 10,
        // backgroundColor:"red"
      }}
      onPress={() => docPicker(onChange)}
    >
      <Flex_Box
        style={{
          width: 85,
        }}
      >
        <FontAwesome name="photo" size={60} color={grey} />
        <Text
          style={{
            fontSize: 14,
            color: dark_grey,
          }}
        >
          Select Image
        </Text>
      </Flex_Box>
    </TouchableOpacity>
  );
};

export default Img_Picker;
