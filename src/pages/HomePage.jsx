import { Container, Typography } from "@mui/material";
import { useMovies } from "../context/MovieContext";
import MovieGrid from "../components/movies/MovieGrid";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

export default function HomePage() {
  const { trending, trendingLoading, trendingError, loadTrending } =
    useMovies();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        🔥 Trending This Week
      </Typography>
      {trendingLoading && <Loader />}
      {trendingError && (
        <ErrorMessage message={trendingError} onRetry={loadTrending} />
      )}
      {!trendingLoading && !trendingError && <MovieGrid movies={trending} />}
    </Container>
  );
}
