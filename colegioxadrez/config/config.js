import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    styles: {
        global: {
            body: {
                height: "100%",
                bg: "blue.200",
                color: "black",
            },fonts: {
        body: "system-ui, sans-serif",
        heading: "inherit",
        monospace: "Menlo, monospace",
    },
    fontWeights: {
        body: 400,
        heading: 700,
        bold: 700,
    },
    fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
    colors: {
        text: {
            primary: "#000",
            secondary: "#666",
            muted: "#999",
        },
        background: {
            primary: "#C6CCB2",
            secondary: "#eee",
            muted: "#f6f6f6",
        },
        brand: {
            primary: "#000",
            secondary: "#666",
            muted: "#999",
        },
    
        
    },
},
    },
});

export default theme;
