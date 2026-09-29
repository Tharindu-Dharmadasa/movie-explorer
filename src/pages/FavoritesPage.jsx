import { Container, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import MovieGrid from "../components/movies/MovieGrid";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        ❤️ My Favorites ({favorites.length})
      </Typography>

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary" gutterBottom>
            You haven't saved any movies yet.
          </Typography>
          <Button component={Link} to="/" variant="contained">
            Discover movies
          </Button>
        </Box>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </Container>
  );
}
