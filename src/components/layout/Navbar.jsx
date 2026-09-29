import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MovieIcon from "@mui/icons-material/Movie";
import { useAppTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { mode, toggleTheme } = useAppTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ gap: 1 }}>
        <MovieIcon color="primary" />
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, display: { xs: "none", sm: "block" } }}
        >
          Movie Explorer
        </Typography>

        <Button component={NavLink} to="/" color="inherit">
          Home
        </Button>
        <Button component={NavLink} to="/favorites" color="inherit">
          Favorites
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Typography
            variant="body2"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            Hi, {user.username}
          </Typography>
        )}
        <IconButton
          onClick={toggleTheme}
          color="inherit"
          aria-label="toggle light/dark mode"
        >
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Button onClick={handleLogout} color="inherit">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
