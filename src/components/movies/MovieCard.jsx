import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { posterUrl } from "../../utils/imageUrl";
import { getYear, formatRating } from "../../utils/formatters";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavorites } from "../../context/FavoritesContext";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  //   Favorite functionality
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  return (
    <Card sx={{ height: "100%", position: "relative" }}>
      <CardActionArea onClick={() => navigate(`/movie/${movie.id}`)}>
        <CardMedia
          component="img"
          image={posterUrl(movie.poster_path)}
          alt={`${movie.title} poster`}
          loading="lazy"
          sx={{ aspectRatio: "2/3", objectFit: "cover" }}
        />
        <CardContent sx={{ p: 1.5 }}>
          <Typography variant="subtitle2" noWrap title={movie.title}>
            {movie.title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 0.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {getYear(movie.release_date)}
            </Typography>
            <Chip
              size="small"
              icon={<StarIcon sx={{ fontSize: 16 }} />}
              label={formatRating(movie.vote_average)}
              color="warning"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Favorite button */}
      <IconButton
        aria-label={favorite ? "remove from favorites" : "add to favorites"}
        onClick={() => toggleFavorite(movie)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "rgba(0,0,0,0.55)",
          color: favorite ? "#ff4d6d" : "#fff",
          "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
        }}
      >
        {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Card>
  );
}
