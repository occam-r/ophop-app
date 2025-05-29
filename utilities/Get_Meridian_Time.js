import dayjs from "dayjs";

export const get_meridian_time = (datestring) => {
  const date = new Date(datestring);
  // Get the hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM/PM
  const ampm = hours >= 12 ? "pm" : "am";

  // Convert hours from 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format minutes with leading zero if needed
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  // Combine the parts into the desired format
  const formattedTime = `${hours}:${minutesStr} ${ampm}`;
console.warn({date,hours,minutes,ampm,minutesStr,formattedTime});

  return formattedTime;
};


export const formatPostDeadline = (dateStart, dateEnd) => {
    const endYear = dayjs(dateEnd).format('YYYY')
    const startYear = dayjs(dateStart).format('YYYY')
    const postDeadline = `${dayjs(dateStart).format('DD MMM')} ${
      startYear !== endYear ? startYear : ''
    } - ${dayjs(dateEnd).format('DD MMM YYYY')}`
    return postDeadline
  }