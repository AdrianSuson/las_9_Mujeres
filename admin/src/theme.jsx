export const tokensDark = {
  grey: {
    0: "#f9f9f9",
    10: "#f0f0f0",
    50: "#e0e0e0",
    100: "#cccccc",
    200: "#999999",
    300: "#666666",
    400: "#333333",
    500: "#000000",
    600: "#000000",
    700: "#000000",
    800: "#000000",
    900: "#000000",
    1000: "#ffffff",
  },
  primary: {
    100: "#cce0cc",
    200: "#99c199",
    300: "#66a266",
    400: "#338333",
    500: "#006400",
    600: "#005000",
    700: "#003c00",
    800: "#002800",
    900: "#001400",
  },
  secondary: {
    100: "#fff6e0",
    200: "#ffedc2",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
  },

    blue: {
    100: "#DCEEFB",
    200: "#B6E0FE",
    300: "#84C5F4",
    400: "#62B0E8",
    500: "#4098D7",
    600: "#2680C2",
    700: "#186FAF",
    800: "#0F609B",
    900: "#0A558C",
    1000: "#003E6B",
  },
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[500], 
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[500], 
            },
            blue: {
              main: tokensDark.blue[500],
              light: tokensDark.blue[400],
              dark: tokensDark.blue[600],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[800],
              paper: tokensDark.grey[700],
            },
        }
        : {
            // Adjust light mode colors if necessary
            primary: {
              ...tokensDark.primary, 
              main: tokensDark.primary[500], 
            },
            secondary: {
              ...tokensDark.secondary, 
              main: tokensDark.secondary[500], 
            },
            blue: {
              main: tokensDark.blue[500],
              light: tokensDark.blue[400],
              dark: tokensDark.blue[600],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[300], 
            },
            background: {
              default: tokensDark.grey[100], 
              paper: tokensDark.grey[50],
            },
        }),
    },


    
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

