"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type Theme = "light" | "dark";
export type MotionPreference = "active" | "paused";
export type TextSize = "sm" | "default" | "lg";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  motion: MotionPreference;
  setMotion: (motion: MotionPreference) => void;
  toggleMotion: () => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  resetToDefaults: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = "megascript_theme";
const MOTION_KEY = "megascript_motion";
const TEXT_SIZE_KEY = "megascript_text_size";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [motion, setMotionState] = useState<MotionPreference>("active");
  const [textSize, setTextSizeState] = useState<TextSize>("default");
  const [mounted, setMounted] = useState(false);

  // Synchronize DOM attributes with current preferences
  const applyPreferences = useCallback(
    (t: Theme, m: MotionPreference, s: TextSize) => {
      const root = document.documentElement;

      // Theme
      if (t === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      // Motion
      root.setAttribute("data-motion", m);

      // Text Size
      root.setAttribute("data-text-size", s);
    },
    []
  );

  useEffect(() => {
    // Read persisted preferences safely on client mount
    const savedTheme = (localStorage.getItem(THEME_KEY) as Theme) || "light";
    const savedMotion = (localStorage.getItem(MOTION_KEY) as MotionPreference) || "active";
    const savedTextSize = (localStorage.getItem(TEXT_SIZE_KEY) as TextSize) || "default";

    setThemeState(savedTheme);
    setMotionState(savedMotion);
    setTextSizeState(savedTextSize);
    applyPreferences(savedTheme, savedMotion, savedTextSize);
    setMounted(true);
  }, [applyPreferences]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
      applyPreferences(newTheme, motion, textSize);
    },
    [motion, textSize, applyPreferences]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  const setMotion = useCallback(
    (newMotion: MotionPreference) => {
      setMotionState(newMotion);
      localStorage.setItem(MOTION_KEY, newMotion);
      applyPreferences(theme, newMotion, textSize);
    },
    [theme, textSize, applyPreferences]
  );

  const toggleMotion = useCallback(() => {
    setMotion(motion === "active" ? "paused" : "active");
  }, [motion, setMotion]);

  const setTextSize = useCallback(
    (newSize: TextSize) => {
      setTextSizeState(newSize);
      localStorage.setItem(TEXT_SIZE_KEY, newSize);
      applyPreferences(theme, motion, newSize);
    },
    [theme, motion, applyPreferences]
  );

  const resetToDefaults = useCallback(() => {
    setThemeState("light");
    setMotionState("active");
    setTextSizeState("default");
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(MOTION_KEY);
    localStorage.removeItem(TEXT_SIZE_KEY);
    applyPreferences("light", "active", "default");
  }, [applyPreferences]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        motion,
        setMotion,
        toggleMotion,
        textSize,
        setTextSize,
        resetToDefaults,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
