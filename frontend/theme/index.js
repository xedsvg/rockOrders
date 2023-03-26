import { extendTheme } from "native-base";

const newColorTheme = {
    brand: {
        900: "#8287af",
        800: "#7c83db",
        700: "#b3bef6",
        "error": "",
        "warning": "",
        "success": ""
    },
    paper: {
        "light": "#fff",
        "medium": "#f7f7f7",
        "dark": "#e5e6ed"
    }
};

export const theme = extendTheme({ colors: newColorTheme });
