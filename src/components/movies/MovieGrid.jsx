import { Box } from "@mui/material";
import MovieCard from "./MovieCard";

// Mobile-first: 2 columns on phones, more as the screen grows.
export const gridSx = {
  display: "grid",
  gap: 2,
  gridTemplateColumns: {
    xs: "repeat(2, 1fr)",
    sm: "repeat(3, 1fr)",
    md: "repeat(4, 1fr)",
    lg: "repeat(5, 1fr)",
    xl: "repeat(6, 1fr)",
  },
};

export default function MovieGrid({ movies }) {
  return (
    <Box sx={gridSx}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </Box>
  );
}