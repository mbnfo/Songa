import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
//import { fillColor } from "pdfkit/js/mixins/color";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#B6B6B6",//"#6E6E6E",//"#CFCFCF",//"#E7E7E7F", // manually changed / "#141b2d",
          500: "#FFFFFF",
          600: "#1F2A40", // 700: "#727681", 900: "#d0d1d5",
          700: "#a1a4ab",//"#868686",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#2e7c67",//"#4cceac",
          600: "#3da58a",//"#70d8bd",
          700: "#4cceac",//"#3da58a",//"#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c3c6fd",
          900: "#e1e2fe",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: { main: colors.primary[800], },
            secondary: { main: colors.greenAccent[500],},
            neutral: {
          //    dark: colors.grey[700],
                 // dark: colors.grey[500],
                dark: "#e0f7fa",
          //    main: colors.grey[500],
                  main: colors.grey[700],
           //   light: colors.grey[400],
                  light: colors.grey[900],
            },
            background: {
              default: colors.primary[500], 
            },

            text: {
              primary: "#e0f7fa",   // lighter text color
              secondary: "#b2ebf2", // softer accent
            },


          components: {

                MuiDataGrid: {
                  styleOverrides: {
                    columnHeaders: {
                      backgroundColor: colors.primary[600], // pick from your tokens
                      color: colors.grey[100],                // header text color
                    },
                  },
                },
                
                  MuiMenuItem: {
                    styleOverrides: {
                      root: {
                        color: colors.grey[100], // light text
                        backgroundColor: colors.primary[400], // dropdown background
                        "&:hover": {
                          backgroundColor: colors.blueAccent[700],
                        },
                      },
                    },
                  },
                  MuiInputLabel: {
                    styleOverrides: {
                      root: {
                        color: colors.blueAccent[200], // lighter labels globally
                      },
                    },
                  },
                  MuiSelect: {
                    styleOverrides: {
                      icon: {
                        color: colors.blueAccent[200], // dropdown arrow color
                      },
                    },
                  },
                  MuiSvgIcon: {
                    styleOverrides: {
                      root: {
                        color: mode === "light" ? "#333333" : "#e0f7fa", 
                      },
                    },
                  },
                },

          MuiPaper: {
              styleOverrides: {
                root: {
                  backgroundColor: colors.primary[400], // dropdown background
                },
              },
            },
            MuiInputLabel: {
              styleOverrides: {
                root: {
                  color: colors.blueAccent[200],
                },
              },
            },
            MuiSelect: {
              styleOverrides: {
                icon: {
                  color: colors.blueAccent[200],
                },
              },
            },
          }
        : {


          //-----------------------------------
            // Palette values for light mode
           // ---------------------------
            primary: {
              main: colors.blueAccent[500], // a friendly blue
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: { 
              dark: "#555555",
              main: "#888888",
              light: "#cccccc",
            },
             background: {
              default: colors.primary[500], 
            },
        
          }),
            components: {
                MuiMenuItem: {
                  styleOverrides: {
                    root: {
                      color:  colors.grey[100],         // dark text for readability
                      backgroundColor: "#ffffff",    // white dropdown background
                      "&:hover": {
                        backgroundColor: "#f0f0f0",  // light grey hover
                      },
                    },
                  },
                },
                MuiInputLabel: {
                  styleOverrides: {
                    root: {
                      color: colors.grey[100],              // medium grey labels
                    },
                  },
                },
                MuiSelect: {
                  styleOverrides: {
                    icon: {
                      color: "#555555",              // dropdown arrow in medium grey
                    },
                  },
                },
                MuiPaper: {
                  styleOverrides: {
                    root: {
                      backgroundColor: "#ffffff",    // cards/paper pure white
                    },
                  },
                },
              }

    },

    typography: {

      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
