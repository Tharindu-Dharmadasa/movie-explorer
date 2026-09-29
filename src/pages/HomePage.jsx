import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useMovies } from "../context/MovieContext";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { getStorage, setStorage } from "../utils/storage";
import SearchBar from "../components/search/SearchBar";
import FilterBar from "../components/search/FilterBar";
import MovieGrid from "../components/movies/MovieGrid";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

export default function HomePage() {
  const {
    trending,
    trendingLoading,
    trendingError,
    loadTrending,
    query,
    results,
    loading,
    error,
    hasMore,
    isSearchActive,
    loadMore,
    retry,
  } = useMovies();

  // switch between infinite scroll and a "Load More" button.
  const [manualLoad, setManualLoad] = useState(() =>
    getStorage("me_manual_load", false),
  );
  const toggleManual = (e) => {
    setManualLoad(e.target.checked);
    setStorage("me_manual_load", e.target.checked);
  };

  // `!error` prevents an endless retry loop when a request fails.
  const sentinelRef = useInfiniteScroll(
    loadMore,
    isSearchActive && hasMore && !loading && !error && !manualLoad,
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <SearchBar />
      <FilterBar />

      {isSearchActive ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h5" fontWeight={700}>
              {query ? `Results for "${query}"` : "Filtered movies"}
            </Typography>
            <FormControlLabel
              control={<Switch checked={manualLoad} onChange={toggleManual} />}
              label="Use Load More button"
            />
          </Box>

          <MovieGrid movies={results} />

          {loading && <Loader count={results.length ? 5 : 10} />}
          {error && <ErrorMessage message={error} onRetry={retry} />}

          {!loading && !error && results.length === 0 && (
            <Typography
              color="text.secondary"
              sx={{ my: 4, textAlign: "center" }}
            >
              No movies found. Try a different search or adjust your filters.
            </Typography>
          )}

          {/* Invisible marker at the bottom of the list, used by infinite scroll */}
          {!manualLoad && results.length > 0 && (
            <div ref={sentinelRef} style={{ height: 1 }} />
          )}

          {manualLoad && hasMore && !loading && (
            <Box sx={{ textAlign: "center", my: 3 }}>
              <Button variant="contained" onClick={loadMore}>
                Load More
              </Button>
            </Box>
          )}
        </>
      ) : (
        <>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            🔥 Trending This Week
          </Typography>
          {trendingLoading && <Loader />}
          {trendingError && (
            <ErrorMessage message={trendingError} onRetry={loadTrending} />
          )}
          {!trendingLoading && !trendingError && (
            <MovieGrid movies={trending} />
          )}
        </>
      )}
    </Container>
  );
}
