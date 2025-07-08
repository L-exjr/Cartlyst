export const COLORS = {
  // Primary colors
  primary: "#6366f1", // indigo
  secondary: "#2196f3", // blue

  // Background colors
  background: "#f8fafc",
  surface: "#fff",
  card: "#ffffff",

  // Text colors
  text: {
    primary: "#1e293b",
    secondary: "#64748b",
    tertiary: "#94a3b8",
    inverse: "#fff",
  },

  // Status colors
  success: "#4CAF50",
  error: "#ef4444",
  warning: "#FF9800",

  // Grays
  gray: {
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
  },

  // Transparent
  transparent: "rgba(0,0,0,0)",

  // Overlays
  overlay: "rgba(0,0,0,0.4)",
  overlayLight: "rgba(255, 255, 255, 0.8)",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 10,
  lg: 15,
  xl: 20,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontFamily: "Inter-Bold" },
  h2: { fontSize: 24, fontFamily: "Inter-Bold" },
  h3: { fontSize: 20, fontFamily: "Inter-SemiBold" },
  body: { fontSize: 16, fontFamily: "Inter-Regular" },
  caption: { fontSize: 14, fontFamily: "Inter-Medium" },
  button: { fontSize: 16, fontFamily: "Inter-SemiBold" },
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
};
