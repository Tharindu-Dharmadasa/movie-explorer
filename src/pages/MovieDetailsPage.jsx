import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Chip,
  Button,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import { getMovieDetails } from "../api/movieService";
import { posterUrl, backdropUrl } from "../utils/imageUrl";
import { getYear, formatRating, formatRuntime } from "../utils/formatters";
import ErrorMessage from "../components/common/ErrorMessage";
import CastList from "../components/movies/CastList";
import TrailerPlayer from "../components/movies/TrailerPlayer";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMovie(await getMovieDetails(id));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <Container sx={{ py: 3 }}>
        <Skeleton variant="rounded" height={300} />
        <Skeleton width="60%" sx={{ mt: 2 }} />
        <Skeleton width="90%" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 3 }}>
        <ErrorMessage message={error} onRetry={load} />
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Go back
        </Button>
      </Container>
    );
  }

  const backdrop = backdropUrl(movie.backdrop_path);

  return (
    <Box>
      {/* Backdrop header (only shown if the movie has one) */}
      {backdrop && (
        <Box
          sx={{
            height: { xs: 180, md: 500 },
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.2), rgba(0,0,0,.85)), url(${backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <Container
        maxWidth="lg"
        sx={{
          py: 3,
          mt: backdrop ? { xs: -8, md: -16 } : 0,
          position: "relative",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, color: backdrop ? "#fff" : "inherit" }}
        >
          Back
        </Button>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            component="img"
            src={posterUrl(movie.poster_path)}
            alt={`${movie.title} poster`}
            sx={{
              width: { xs: 180, md: 280 },
              borderRadius: 3,
              boxShadow: 6,
              alignSelf: { xs: "center", md: "flex-start" },
            }}
          />

          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              {movie.title}{" "}
              <Typography component="span" variant="h5" color="text.secondary">
                ({getYear(movie.release_date)})
              </Typography>
            </Typography>
            {movie.tagline && (
              <Typography color="text.secondary" fontStyle="italic">
                {movie.tagline}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                my: 2,
                alignItems: "center",
              }}
            >
              <Chip
                icon={<StarIcon />}
                color="warning"
                label={`${formatRating(movie.vote_average)} / 10`}
              />
              <Chip label={formatRuntime(movie.runtime)} variant="outlined" />
              {movie.genres?.map((g) => (
                <Chip
                  key={g.id}
                  label={g.name}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>

            <Typography variant="h6" fontWeight={700}>
              Overview
            </Typography>
            <Typography sx={{ mb: 3 }}>
              {movie.overview || "No overview available."}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          Top Cast
        </Typography>
        <CastList cast={movie.credits?.cast} />

        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ mt: 4, mb: 1, textAlign: "center" }}
        >
          Trailer
        </Typography>
        <TrailerPlayer videos={movie.videos?.results} />
      </Container>
    </Box>
  );
}
