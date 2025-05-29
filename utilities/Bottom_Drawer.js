import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";

const Bottom_Drawer = ({
  children,
  label,
  snap_points,
  handleChange,
  setindex_change_func,
}) => {
  // ref
  const bottomSheetRef = useRef(null);

  const [ind, setind] = useState(0);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
    setind(index);
    if (handleChange) {
      handleChange(index);
    }
  }, []);

  const changeBottomSheet = (index) => {
    bottomSheetRef.current?.snapToIndex(index);
  };

  useEffect(() => {
    if (setindex_change_func) {
      setindex_change_func(() => changeBottomSheet);
    }
  }, []);

  const snapPoints = useMemo(() => snap_points || ["35%", "60%"], []);

  // renders
  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
    >
      <BottomSheetView style={styles.contentContainer}>
        {ind == 0 && label}
        {ind == 1 && children}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
  },
});

export default Bottom_Drawer;
