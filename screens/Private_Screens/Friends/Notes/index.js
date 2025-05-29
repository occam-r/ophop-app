import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import NoteInput from "./NoteInput";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import return_error from "../../../../utilities/Return_Error";
import { get_notes_api } from "../../../../apis";
import NotesList from "./NotesList";
import { set_loading_action } from "../../../../redux_prog/actions/base_action";

const Notes = ({ navigation }) => {
  const [notes, setnotes] = useState([]);
  const IsFocused = useIsFocused();
  const { token } = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();

  const get_notes = () => {
    dispatch(set_loading_action(true));
    get_notes_api(token)
      .then((res) => {
        dispatch(set_loading_action(false));
        setnotes(res?.data?.data?.notes);
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.error(JSON.stringify(err));
      });
  };

  useEffect(get_notes, [IsFocused]);

  return (
    <>
      <NotesList setnotes={setnotes} notes={notes} navigation={navigation} />
      <NoteInput setnotes={setnotes} notes={notes} />
    </>
  );
};

export default Notes;
