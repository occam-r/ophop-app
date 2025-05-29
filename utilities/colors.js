export const theme_color = "rgb(47, 111, 228)";
export const light_theme_bg = "hsla(219, 76%, 97%, 1)";
export const light_theme = {
  text_color: "#000",
  backgroundColor: "#fff",
  grey: "#B6B6B6",
  shadowColor: "#000",
  green: "green",
  light_grey: "#F7F6F6",
  dark_grey: "grey",
  pink: "#F47CE4",
  blue: "blue",
  red: "red",
  light_red: `hsla(335,${82}%,${98}%,1)`,
};

export const dark_theme = {
  text_color: "#fff",
  backgroundColor: "#000",
  grey: "#fff",
  shadowColor: "#fff",
};

export const generateRandomColor = () => {
  // Generate random values for RGB (red, green, blue)
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);

  // Convert RGB to hexadecimal format
  var hexColor =
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0");

  return hexColor;
};
