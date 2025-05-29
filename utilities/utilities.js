import dayjs from "dayjs";
import { Dimensions, Text } from "react-native";
import { light_theme } from "./colors";
import Flex_Box from "./Flex_Box";
import { Image } from "react-native-compressor";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const get_error_msg = (err) => {
  return err?.message?.split("]")[1]?.trim();
};

export const truncateLongShopName = (shopName, maxLength) => {
  if (shopName?.length > maxLength) {
    return shopName.slice(0, maxLength) + "..";
  } else {
    return shopName;
  }
  // return shopName?.length && shopName.slice(0, maxLength);
};

export const getUserInitials = (initUserName) => {
  if (initUserName) {
    const nameToArray = initUserName.split(" ");
    var abbreviatedName = nameToArray
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    if (abbreviatedName.length > 2) {
      return abbreviatedName.slice(0, 2);
    }
    
    return abbreviatedName;
  } else {
    return initUserName;
  }
};

export const screen_height = Dimensions.get("screen").height;
export const screen_width = Dimensions.get("screen").width;

const minutesFromDayStart = (time) =>
  parseInt(dayjs(time).format("H"), 10) * 60 +
  parseInt(dayjs(time).format("m"), 10);

export const isShopOpen = (shopSchedule) => {
  if (shopSchedule) {
    const currentDay = dayjs().format("dddd").toLowerCase();
    const { open, close } = shopSchedule[currentDay];
    const minutesFromDayStartToOpenTime = minutesFromDayStart(open);
    const minutesFromDayStartToCloseTime = minutesFromDayStart(close);

    if (shopSchedule[currentDay].isOpen === false) {
      return false;
    }
    return (
      minutesFromDayStartToOpenTime < minutesFromDayStart(dayjs()) &&
      minutesFromDayStartToCloseTime > minutesFromDayStart(dayjs())
    );
  }
};

export function getDateDifference(date1, date2) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  const diffInMs = Math.abs(date2 - date1);

  const diffInMinutes = Math.floor(diffInMs / msPerMinute);
  const diffInHours = Math.floor(diffInMs / msPerHour);
  const diffInDays = Math.floor(diffInMs / msPerDay);

  const result =
    diffInDays > 0 ? diffInDays : diffInHours > 0 ? diffInHours : diffInMinutes;

  const result_suffix =
    diffInDays > 0 ? " days" : diffInHours > 0 ? " hours" : " mins";

  return {
    diffInMinutes,
    diffInHours,
    diffInDays,
    result: result + result_suffix,
    result_suffix,
  };
}

export const Not_Found_Text = ({ text }) => {
  const is_loading = useSelector((state) => state?.baseReducer?.is_loading);
  const { dark_grey } = light_theme;

  const [empty_page, setempty_page] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setempty_page(false);
    }, 2000); // 3-second delay

    // Cleanup function to clear timeout
    return () => clearTimeout(timeout);
  }, []);

  if (is_loading || empty_page) {
    return null;
  }
  return (
    <Flex_Box>
      <Text
        style={{
          fontWeight: 500,
          color: dark_grey,
          marginTop: 10,
        }}
      >
        {text}
      </Text>
    </Flex_Box>
  );
};

export const compress_img = async (file) => {
  const result = await Image.compress(file?.split(",")[1], {
    input: "base64",
    compressionMethod: "manual",
    maxWidth: 1000,
    quality: 0.8,
  });
  return result;
};

export const convertDays = (days) => {
  const years = Math.floor(days / 365);
  let remainingDays = days % 365;
  const months = Math.floor(remainingDays / 30);
  remainingDays %= 30;
  const r_value =
    years > 0
      ? years + " years"
      : months > 0
      ? months + " months"
      : remainingDays + " days";
  return r_value;
  // return `${years} years, ${months} months, and ${remainingDays} days`;
};
