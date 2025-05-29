import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { Dimensions } from "react-native";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a moment",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

export const adaptLoginData = (formData, dial_code) => {
  const { phone, password } = formData;
  const timezone = dayjs.tz.guess();
  const device = "mobile";
  const formattedPhone = dial_code?.replace("+", "") + phone;

  return {
    phone: formattedPhone,
    password,
    timezone,
    device_name: device,
    role: "user",
  };
};

export const adaptSignupData = (formData) => {
  const { phone, password, email, username, verificationCode,fcm_token,last_name ,role="user"} = formData;
  const timezone = dayjs.tz.guess();
  const device_name = window.innerWidth > 1000 ? "desktop" : "mobile";

  return {
    phone,
    password,
    username,
    email,
    timezone,
    device_name: 'mobile',
    role,
    verificationCode,
    fcm_token,
    last_name,
  };
};
