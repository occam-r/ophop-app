import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import Flex_Box from "../../../../../../utilities/Flex_Box";
import { light_theme } from "../../../../../../utilities/colors";
import {
  formatPostDeadline,
  get_meridian_time,
} from "../../../../../../utilities/Get_Meridian_Time";
import { Weekdays } from "../../../../../../utilities/WeekDays";
import Bottom_Modal from "../../../../../../utilities/Bottom_Modal";

const Latest_Updates = ({ latest_updates, setopen, setpost_details }) => {
  const { text_color, green, dark_grey, light_grey, grey, pink } = light_theme;

  return (
    <View>
      <Text
        style={{
          color: grey,
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        Latest Updates
      </Text>
      <Flex_Box
        style={{
          justifyContent: "start",
          //   flexDirection: "row",
          marginVertical: 8,
          gap: 15,
          overFlow: "auto",
          flexWrap: "wrap",
        }}
      >
        {latest_updates?.length > 0 &&
          latest_updates?.map((el, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setopen(true);
                  setpost_details(el);
                }}
                style={{
                  width:"100%"
                }}
                key={index}
              >
                <Text
                  style={{
                    color: text_color,
                  }}
                >
                  {el?.postTitle}
                </Text>
                {
                  el?.startTime &&
                  <Flex_Box
                    style={{
                      marginTop: 5,
                      backgroundColor: light_grey,
                      borderRadius: 5,
                      padding: 5,
                      justifyContent:"start",
                      flexDirection:"row"
                    }}
                  >
                    <Text
                      style={{
                        color: pink,
                        fontWeight: 500,
                      }}
                    >
                      {formatPostDeadline(el?.startTime, el?.endTime)}
                    </Text>
                  </Flex_Box>
                }
              </TouchableOpacity>
            );
          })}
      </Flex_Box>
    </View>
  );
};

export default Latest_Updates;

// import React, { useCallback, useMemo, useRef } from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';
// import {
//   BottomSheetModal,
//   BottomSheetView,
//   BottomSheetModalProvider,
// } from '@gorhom/bottom-sheet';

// const Latest_Updates = () => {
//   // ref
//   const bottomSheetModalRef = useRef(null);

//   // variables
//   const snapPoints = useMemo(() => ['25%', '50%'], []);

//   // callbacks
//   const handlePresentModalPress = useCallback(() => {
//     bottomSheetModalRef.current?.present();
//   }, []);
//   const handleSheetChanges = useCallback((index) => {
//     console.log('handleSheetChanges', index);
//   }, []);

//   // renders
//   return (
//     <BottomSheetModalProvider>
//       <View style={styles.container}>
//         <Button
//           onPress={handlePresentModalPress}
//           title="Present Modal"
//           color="black"
//         />
//         <BottomSheetModal
//           ref={bottomSheetModalRef}
//         //   index={1}
//           snapPoints={snapPoints}
//           onChange={handleSheetChanges}
//         >
//           <BottomSheetView style={styles.contentContainer}>
//             <Text>Awesome 🎉</Text>
//           </BottomSheetView>
//         </BottomSheetModal>
//       </View>
//     </BottomSheetModalProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 24,
//     justifyContent: 'center',
//     backgroundColor: 'grey',
//   },
//   contentContainer: {
//     alignItems: 'center',
//   },
// });

// export default Latest_Updates;
