import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Typography,
  Button,
} from "@mui/material";
import { getGenres } from "../../api/movieService";
import { useMovies } from "../../context/MovieContext";

export default function FilterBar() {
  const { filters, setFilters, clearFilters } = useMovies();
  const [genres, setGenres] = useState([]);
  const [ratingDraft, setRatingDraft] = useState(filters.rating);

  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch(() => {}); // filters are a bonus; fail silently
  }, []);

  useEffect(() => setRatingDraft(filters.rating), [filters.rating]);

  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        my: 2,
      }}
    >
      <FormControl
        size="small"
        sx={{ minWidth: 160, flex: { xs: "1 1 100%", sm: "0 0 auto" } }}
      >
        <InputLabel>Genre</InputLabel>
        <Select
          label="Genre"
          value={filters.genre}
          onChange={(e) => update({ genre: e.target.value })}
        >
          <MenuItem value="">All genres</MenuItem>
          {genres.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label="Year"
        placeholder="e.g. 2023"
        value={filters.year}
        onChange={(e) =>
          update({ year: e.target.value.replace(/\D/g, "").slice(0, 4) })
        }
        sx={{ width: 120 }}
      />

      <Box sx={{ width: { xs: "100%", sm: 220 } }}>
        <Typography variant="caption">Min rating: {ratingDraft}</Typography>
        <Slider
          size="small"
          min={0}
          max={9}
          step={1}
          value={ratingDraft}
          onChange={(_, v) => setRatingDraft(v)}
          onChangeCommitted={(_, v) => update({ rating: v })} // request only when the user lets go
        />
      </Box>

      <Button onClick={clearFilters}>Clear filters</Button>
    </Box>
  );
}
