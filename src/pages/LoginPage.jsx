import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Collapse,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import { Navigate, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MovieIcon from "@mui/icons-material/Movie";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useAuth } from "../context/AuthContext";
import PosterWall from "../components/auth/PosterWall";

/* ---------- Always-dark theme just for this page ---------- */
const authTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#e50914" },
    background: { default: "#0b0d12", paper: "#151922" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 12 } } },
  },
});

/* ---------- Animations ---------- */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const float = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(40px, 30px) scale(1.1); }
`;
const shake = keyframes`
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(3px); }
  30%, 50%, 70% { transform: translateX(-6px); }
  40%, 60% { transform: translateX(6px); }
`;
const noMotion = {
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
};

/* ---------- Password strength (0 to 4) ---------- */
const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["error", "error", "warning", "info", "success"];
const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
};

/* ---------- Password input with show/hide ---------- */
function PasswordField({ label, value, onChange, error, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <FormControl fullWidth error={Boolean(error)}>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        label={label}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={show ? "hide password" : "show password"}
              onClick={() => setShow((s) => !s)}
              edge="end"
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

export default function LoginPage() {
  const { user, register, login, loginDemo } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0); // 0 = sign in, 1 = sign up
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shaking, setShaking] = useState(false);

  if (user) return <Navigate to="/" replace />; // already logged in

  const isSignUp = tab === 1;
  const strength = getStrength(form.password);
  const setField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const switchTab = (value) => {
    setTab(value);
    setErrors({});
    setServerError("");
  };

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  const validate = () => {
    const e = {};
    if (isSignUp && !form.name.trim()) e.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      e.email = "Enter a valid email address.";
    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters.";
    if (isSignUp && form.confirm !== form.password)
      e.confirm = "Passwords do not match.";
    return e;
  };

  // Runs a login/register action and handles loading and errors in one place.
  const run = async (action) => {
    setSubmitting(true);
    setServerError("");
    const result = await action();
    setSubmitting(false);
    if (result.ok) {
      navigate("/");
    } else {
      setServerError(result.error);
      triggerShake();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return triggerShake();
    run(() => (isSignUp ? register(form) : login(form.email, form.password)));
  };

  return (
    <ThemeProvider theme={authTheme}>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
          p: 2,
          bgcolor: "#0b0d12",
          color: "text.primary",
        }}
      >
        {/*  scrolling posters */}
        <PosterWall />

        {/*  glowing floating blobs */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: "-10%",
            left: "-8%",
            width: 460,
            height: 460,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(229,9,20,.6), transparent 65%)",
            filter: "blur(60px)",
            animation: `${float} 14s ease-in-out infinite`,
            ...noMotion,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            bottom: "-12%",
            right: "-6%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,122,69,.45), transparent 65%)",
            filter: "blur(70px)",
            animation: `${float} 18s ease-in-out infinite reverse`,
            ...noMotion,
          }}
        />

        {/* dark vignette so the card stays readable */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(11,13,18,.55) 0%, rgba(11,13,18,.92) 85%)",
          }}
        />

        {/* Card */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 440,
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            bgcolor: "rgba(21,25,34,.72)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,.08)",
            boxShadow: "0 24px 60px rgba(0,0,0,.55)",
            animation: `${fadeUp} .7s ease both`,
            ...noMotion,
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <MovieIcon color="primary" sx={{ fontSize: 34 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(90deg, #e50914, #ff7a45)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Movie Explorer
            </Typography>
          </Box>

          {/* Sliding Sign in / Sign up toggle */}
          <Box
            sx={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              p: 0.5,
              mb: 3,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,.06)",
            }}
          >
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                top: 4,
                bottom: 4,
                left: 4,
                width: "calc(50% - 4px)",
                borderRadius: 999,
                bgcolor: "primary.main",
                transition: "transform .3s cubic-bezier(.4,0,.2,1)",
                transform: isSignUp ? "translateX(100%)" : "translateX(0)",
              }}
            />
            {["Sign in", "Sign up"].map((label, i) => (
              <Button
                key={label}
                disableRipple
                onClick={() => switchTab(i)}
                sx={{
                  position: "relative",
                  zIndex: 1,
                  borderRadius: 999,
                  color: tab === i ? "#fff" : "text.secondary",
                  "&:hover": { bgcolor: "transparent" },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* Heading re-animates whenever the tab changes */}
          <Box
            key={tab}
            sx={{ animation: `${fadeUp} .4s ease both`, mb: 2.5, ...noMotion }}
          >
            <Typography variant="h5" fontWeight={800}>
              {isSignUp ? "Create your account" : "Welcome back"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isSignUp
                ? "Join to save favorites and explore movies."
                : "Sign in to keep exploring."}
            </Typography>
          </Box>

          {/* Form (shakes when something is wrong) */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "grid",
              gap: 2,
              animation: shaking ? `${shake} .45s` : "none",
              ...noMotion,
            }}
          >
            {serverError && <Alert severity="error">{serverError}</Alert>}

            {/* Name field slides open on Sign up */}
            <Collapse in={isSignUp} unmountOnExit>
              <TextField
                fullWidth
                label="Full name"
                value={form.name}
                onChange={setField("name")}
                error={Boolean(errors.name)}
                helperText={errors.name}
                autoComplete="name"
              />
            </Collapse>

            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={setField("email")}
              error={Boolean(errors.email)}
              helperText={errors.email}
              autoComplete="email"
            />

            <Box>
              <PasswordField
                label="Password"
                value={form.password}
                onChange={setField("password")}
                error={errors.password}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
              {/* Strength meter (sign up only) */}
              <Collapse in={isSignUp && form.password.length > 0} unmountOnExit>
                <LinearProgress
                  variant="determinate"
                  value={(strength + 1) * 20}
                  color={STRENGTH_COLORS[strength]}
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Strength: {STRENGTH_LABELS[strength]}
                </Typography>
              </Collapse>
            </Box>

            <Collapse in={isSignUp} unmountOnExit>
              <PasswordField
                label="Confirm password"
                value={form.confirm}
                onChange={setField("confirm")}
                error={errors.confirm}
                autoComplete="new-password"
              />
            </Collapse>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              sx={{
                py: 1.3,
                borderRadius: 999,
                background: "linear-gradient(90deg, #e50914, #ff5a36)",
                boxShadow: "0 8px 24px rgba(229,9,20,.35)",
                transition: "transform .2s, box-shadow .2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 30px rgba(229,9,20,.5)",
                },
              }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : isSignUp ? (
                "Create account"
              ) : (
                "Sign in"
              )}
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              startIcon={<PlayArrowIcon />}
              onClick={() => run(loginDemo)}
              disabled={submitting}
              sx={{
                borderRadius: 999,
                py: 1.1,
                borderColor: "rgba(255,255,255,.25)",
              }}
            >
              Try demo account
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "center", mt: 3 }}
          >
            Demo project: accounts are stored locally in your browser.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
