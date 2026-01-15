import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    colors: {
        brand: {
            bgLight: "white", // light mode background
            bgDark: "black",  // dark mode background
            textParagraph: "#111111", // light mode text
            textTitle: "#f9f9f9",  // dark mode text
        }
    }
});

export default theme;