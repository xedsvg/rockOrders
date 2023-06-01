import { extendTheme } from "native-base";

const colorTheme = {
  brand: {
    900: "#8287af",
    800: "#000",
    700: "#2E2E2E",
  },

  paper: {
    primary: "#00BFFF",
    medium: "#1A1A1A",
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
      borderTopColor: "hsl(19.1, 80%, 53.1%)",
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
        bgImg:
          "linear-gradient(201.52deg, hsl(19.1, 80%, 53.1%) 0px, hsl(19.1, 79.4%, 28.6%) 100%)",
      }),
      open: (...props) => ({
        ...props,
        borderLeftWidth: 2,
        borderLeftColor: "#FF7F50",
        bgImg:
          "linear-gradient(201.52deg, rgba(15, 92, 134, 0.1) 0px, rgba(10, 108, 160, 0.1) 100%)",
      }),
    },
  },

  Button: {
    variants: {
      solid: (props) => ({
        ...props,
        bg: "hsl(19.1, 80%, 53.1%)",
        borderRadius: "56px",
        _hover: {
          bg: "hsl(19.1, 80%, 43.1%)",
        },
        _pressed: {
          bg: "hsl(19.1, 80%, 63.1%)",
        },
      }),
      outline: (props) => ({
        ...props,
        _text: {
          color: "text.light",
        },
        borderWidth: "2px",
        borderColor: "hsl(19.1, 80%, 73.1%)",
        borderRadius: "56px",
        _hover: {
          borderColor: "hsl(19.1, 80%, 53.1%)",
        },
        _pressed: {
          borderColor: "hsl(19.1, 80%, 43.1%)",
        },
      }),
    },
  },
};
export const theme = extendTheme({ components, colors: colorTheme });
