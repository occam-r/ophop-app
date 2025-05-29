import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

const Bottom_Modal = ({ children, label, open, setopen, snap_points }) => {
  // ref
  const bottomSheetModalRef = useRef(null);
  const [ind, setind] = useState(0);

  // variables
  const snapPoints = useMemo(() => ["100%", "100%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
    setind(index);
    if (index == -1) {
      setopen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      handlePresentModalPress();
    }
  }, [open]);

  // renders
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={ind}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          {ind == 0 && label}
          {ind == 1 && children}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
});

export default Bottom_Modal;
