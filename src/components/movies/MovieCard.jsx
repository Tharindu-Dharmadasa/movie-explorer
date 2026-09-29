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

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

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
    </Card>
  );
}
