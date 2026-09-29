import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { MovieProvider } from "./context/MovieContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuth } from "./context/AuthContext";

// Wraps protected pages with the Navbar.
const Protected = ({ children }) => (
  <ProtectedRoute>
    <Navbar />
    {children}
  </ProtectedRoute>
);

// Remounts the data providers whenever the logged-in user changes,
// so one user's favorites and search never leak into another's session.
function UserScopedProviders({ children }) {
  const { user } = useAuth();
  const scope = user?.email || "guest";
  return (
    <FavoritesProvider key={scope}>
      <MovieProvider key={scope}>{children}</MovieProvider>
    </FavoritesProvider>
  );
}

export default function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <UserScopedProviders>
          <BrowserRouter
            future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
          >
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <Protected>
                    <HomePage />
                  </Protected>
                }
              />
              <Route
                path="/movie/:id"
                element={
                  <Protected>
                    <MovieDetailsPage />
                  </Protected>
                }
              />
              <Route
                path="/favorites"
                element={
                  <Protected>
                    <FavoritesPage />
                  </Protected>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </UserScopedProviders>
      </AuthProvider>
    </AppThemeProvider>
  );
}
