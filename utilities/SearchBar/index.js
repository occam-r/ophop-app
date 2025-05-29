import React from "react";
import SearchBar_Comp from "./SearchBar";

const SearchBar = ({ label, navigation, select_style, tag, tagName }) => {
  return (
    <SearchBar_Comp
      label={label}
      select_style={select_style}
      navigation={navigation}
      tag={tag}
      tagName={tagName}
    />
  );
};

export default SearchBar;
