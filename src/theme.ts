import {
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme,
} from "react-native-paper";

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#2457D6",
    secondary: "#52627A",
    tertiary: "#006B5F",
    background: "#F7F8FC",
    surface: "#FFFFFF",
    surfaceVariant: "#EEF1F7",
    outline: "#CBD2DF",
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#AFC5FF",
    secondary: "#BEC7DC",
    tertiary: "#5CDBC9",
    background: "#101318",
    surface: "#171A21",
    surfaceVariant: "#232833",
    outline: "#434A58",
  },
};
