import { extendTheme } from "native-base";

const colorTheme = {
  brand: {
    900: "#8287af",
    // 800: "#3B20C9",
    800: "#352A57",
    700: "#2E2E2E",
  },
  paper: {
    primary: "#00BFFF",
    medium: "#040719",
    dark: "#e5e6ed",
  },
  text: {
    light: "#F8F8FF",
    medium: "#B0B0B0",
    dark: "#e5e6ed",
  },

  background: "#252525",
  primary: "#4169E1",
  secondary: "#483D8B",
  accent: "#FFD700",
  error: "#B22222",
  success: "#8FBC8F",
  info: "#48D1CC",

  reserved: "#9932CC",
  available: "#556B2F",
};

const components = {
  ActionsheetContent: {
    baseStyle: (...props) => ({
      ...props,
      borderTopColor: "#856adb",
      borderTopWidth: 2,
      bg: "paper.medium",
      _dragIndicator: {
        display: "none",
      },
      _dragIndicatorWrapper: {
        display: "none",
      },
      _dragIndicatorWrapperOffSet: {
        display: "none",
      },
    }),
    variants: {
      item: (...props) => ({
        ...props,
        _dragIndicator: {
          bg: "red",
          display: "none",
        },
      }),
    },
  },

  Alert: {
    baseStyle: {
      borderRadius: "26px",
    },
    variants: {
      "active-blue": (...props) => ({
        ...props,
        bgImg:
          "linear-gradient(201.52deg, hsl(203.4, 100%, 38.0%) 0px, hsl(205.5, 89.4%, 18.6%) 100%)",
      }),
      active: (...props) => ({
        ...props,
        borderLeftWidth: 2,
        borderLeftColor: "#FF7F50",
        bg: "rgba(53, 42, 87, 1)",
      }),
      open: (...props) => ({
        ...props,
        borderLeftWidth: 2,
        // #FF7F50
        borderLeftColor: "#50ff73",
        bgImg:
          "linear-gradient(201.52deg, rgba(15, 92, 134, 0.1) 0px, rgba(10, 108, 160, 0.1) 100%)",
      }),
    },
  },

  Button: {
    variants: {
      solid: (props) => ({
        ...props,
        bg: "#856adb",
        borderRadius: "56px",
        _hover: {
          bg: "#9D87E2",
        },
        _pressed: {
          bg: "#6A54AF",
        },
      }),
      outline: (props) => ({
        ...props,
        _text: {
          color: "text.light",
        },
        borderWidth: "2px",
        borderColor: "#856adb",
        borderRadius: "56px",
        _hover: {
          borderColor: "#9D87E2",
        },
        _pressed: {
          borderColor: "#6A54AF",
        },
      }),
    },
  },
};
export const theme = extendTheme({ components, colors: colorTheme });

export const version = "0.0.1";
