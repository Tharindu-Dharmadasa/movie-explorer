import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getStorage, setStorage } from "../utils/storage";

const ThemeContext = createContext(null);

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(() => getStorage("me_theme", "dark"));

  useEffect(() => setStorage("me_theme", mode), [mode]);

  const toggleTheme = useCallback(
    () => setMode((m) => (m === "dark" ? "light" : "dark")),
    [],
  );

  // Rebuild the MUI theme only when the mode changes.
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode, primary: { main: "#e50914" } },
        shape: { borderRadius: 12 },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeContext);
