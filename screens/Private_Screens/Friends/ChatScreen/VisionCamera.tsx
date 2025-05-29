import * as React from "react";
import { useCallback, useRef, useState } from "react";
import type { AlertButton } from "react-native";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { Code } from "react-native-vision-camera";
import { useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import { Camera } from "react-native-vision-camera";
import { useIsFocused } from "@react-navigation/core";
import { useIsForeground } from "../../../../hooks/useIsForeGround";
import type { CameraPermissionStatus } from "react-native-vision-camera";
import Button_Comp from "../../../../utilities/Button_Comp";
import Flex_Box from "../../../../utilities/Flex_Box";
import { theme_color } from "../../../../utilities/colors";

export function VisionCamera({
  setdevice_id,
  setModalVisible,
  setcamera_open,
}): React.ReactElement {
  // Permissions code--------------------------------------
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  const requestMicrophonePermission = useCallback(async () => {
    console.log("Requesting microphone permission...");
    const permission = await Camera.requestMicrophonePermission();
    console.log(`Microphone permission status: ${permission}`);

    if (permission === "denied") await Linking.openSettings();
    setMicrophonePermissionStatus(permission);
  }, []);

  const requestCameraPermission = useCallback(async () => {
    console.log("Requesting camera permission...");
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === "denied") await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);

  React.useEffect(() => {
    if (cameraPermissionStatus != "granted") {
      requestCameraPermission();
    }
  }, [cameraPermissionStatus]);

  // --------------------------------------------------------------



  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      // backgroundColor: "red",
      height: 500,
      // width: "90%",
      // marginTop: 5,
      backgroundColor:"#fff",
    },
    zoomBox: {
      position: "absolute",
      left: "25%", // Adjust the position and size as needed
      top: "18%",
      width: "50%",
      height: "50%",
      borderColor: "white",
      borderRadius: 20,
      borderWidth: 2,
      borderStyle: "dashed",
    },
  });
  // 1. Use a simple default back camera
  const device = useCameraDevice("back");

  // 2. Only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  // 3. (Optional) enable a torch setting
  const [torch, setTorch] = useState(false);

  // 4. On code scanned, we show an aler to the user
  const isShowingAlert = useRef(false);

  function formatBluetoothAddress(address) {
    return address?.match(/.{1,2}/g)?.join(":");
  }

  const onCodeScanned = useCallback((codes: Code[]) => {
    console.log(`Scanned ${codes.length} codes:`, codes);
    const value = codes[0]?.value?.split(",")[0]?.split(":")[1];
    const mac = formatBluetoothAddress(value);
    if (value?.length == 12) {
      setdevice_id(mac);
      setModalVisible(false);
    }

    if (value == null) return;
    if (isShowingAlert.current) return;
    // showCodeAlert(value, () => {
    //   isShowingAlert.current = false;
    // });
    isShowingAlert.current = true;
  }, []);

  // 5. Initialize the Code Scanner to scan QR codes and Barcodes
  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: onCodeScanned,
  });

  return (
    <View style={styles.container}>
      {cameraPermissionStatus == "granted" && (
        <>
          {device != null && (
            <>
              <Camera
                style={{
                  ...StyleSheet.absoluteFill
                  // height: 320,
                  // marginTop:90
                  // width: 300,
                }}
                device={device}
                isActive={isActive}
                codeScanner={codeScanner}
                torch={torch ? "on" : "off"}
                enableZoomGesture={true}
              />

              {/ <View style={styles.zoomBox} /> /}
            </>
          )}
        </>
      )}
      <Flex_Box
        style={{
          width: "100%",
          flexDirection: "row",
          gap: 15,
          marginTop: 440,
          // backgroundColor:"#fff"
        }}
      >
        <Button_Comp
          onClick={() => setTorch(!torch)}
          btn_style={{
            width: "48%",
            borderWidth: 2,
            borderColor: theme_color,
            paddingVertical:10
          }}
          label={torch ? "Flash-off" : "Flash"}
        />
        <Button_Comp
          onClick={() => setcamera_open(false)}
          btn_style={{
            width: "48%",
            backgroundColor:"#fff",
            borderWidth: 2,
            borderColor: theme_color,
            paddingVertical:10
          }}
          text_style={{
            color: theme_color,
          }}
          label={"Capture"}
        />
      </Flex_Box>
    </View>
  );
}













