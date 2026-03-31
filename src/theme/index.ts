import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const palette = {
  ink: "#08111E",
  navy: "#0E223C",
  blue: "#1E4F9A",
  sky: "#75B8FF",
  teal: "#4ED8C7",
  gold: "#F4B63D",
  cream: "#F7F4EB",
  mist: "#D6E4F7",
  slate: "#7A8EA8",
  card: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.12)",
  success: "#6CE5A8",
  warning: "#FFD27A",
  danger: "#FF8A7A"
};

export const theme = {
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 36
  },
  radius: {
    sm: 12,
    md: 18,
    lg: 24,
    pill: 999
  },
  typography: {
    display: {
      fontFamily: "Avenir Next",
      fontSize: 28,
      fontWeight: "700" as const
    },
    title: {
      fontFamily: "Avenir Next",
      fontSize: 20,
      fontWeight: "700" as const
    },
    body: {
      fontFamily: "System",
      fontSize: 15,
      fontWeight: "400" as const
    },
    label: {
      fontFamily: "System",
      fontSize: 12,
      fontWeight: "600" as const,
      letterSpacing: 0.3
    }
  },
  screen: {
    width
  }
};
